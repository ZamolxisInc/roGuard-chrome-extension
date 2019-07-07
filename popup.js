var outUrl;
var state;
var voteState = "not_voted";
// state il folosim ca sa stim ce elemente sa afisam in functie de issue
// votestate il folosim ca sa retinem dupa ce facem checkVote daca a votat


/* ===== EXECUTE ===== */
chrome.windows.getCurrent(function(window) {
    // get the current active tab in that window
    chrome.tabs.query({
        active: true, //get current openned window
        windowId: window.id
    }, function (tabs) {
        var tab = tabs[0];
		var url = new URL(tab.url);
		var domain = url.hostname;
		outUrl = domain;
		document['getElementById']('url').innerHTML = outUrl; //domain
    });
});


// butoane de vot:
document.addEventListener('DOMContentLoaded', function() {///detecteaza clickul pe voteUp
    var link = document.getElementById('upvoteButton');
    link.addEventListener('click', function() {
        vote(true);
    });
});

document.addEventListener('DOMContentLoaded', function() {///detecteaza clickul pe voteDown
    var link = document.getElementById('downvoteButton');
    link.addEventListener('click', function() {
        vote(false);
    });	
});


/*-- SYNC --*/
// check and update state
chrome.storage.sync.get(['issue', 'domain','punctaj'], function(items) {
		// extrag punctajul si issue dupa domain
		 var body = document.body;
		 if(items['punctaj'] != 0)
			 document['getElementById']('myRange').value = items['punctaj'];
		 else
			 document['getElementById']('myRange').value = "5";
		
	 	switch(items['issue']) {
	 		// le-am reasezat in changeSTATE
	 		case "no_connection"  : changeState("no_connection_state"); break;
	 		case "banned"         : changeState("banned_state");	    break;
	 		case "fakenews"       : changeState("fakenews_state"); 		break;
	 		case "malware"		  : changeState("malware_state"); 		break;
	 		case "alt_motiv"	  : changeState("alt_motiv_state");		break;
	 		case "clean"		  : changeState("clean_state");			break;
	 		default /*nu a votat*/: changeState("not_reported_state"); 	break;
	 	}
});

// check if user voted this domain before
checkVote();







/* ==== Functii ====*/
function vote(positive){
	if(positive === true) {
		if (voteState === "voted_down" || voteState === "not_voted"){
			// logica pentru sendVote(voteup);
			var data = createDATA(outUrl, "clean", "");
			var url = 'https:roguard.hackout.ro/voteDomain/';
			try{
				postData(url, data)
				.then(data => { alert("positive vote has been registered!!"); });
			}catch(error){
				alert("Vote up FAILED"); 
			}
		}
		// else nu mai afisam nimic daca apasa pe UP si votase deja up
		votedUP();
	}
	else if(positive === false){
		window.location.href="downvote.html";
	}
	// votedUP si DOWN trebuie doar sa adauge peste html-ul existent un text			
}


// schimb state-ul in functie de issue
function changeState(param){
	// in functie de param stim cum sa arate popup.html
	var body = document.body;

	switch(param){
		case "no_connection_state":
			  state = "no_connection";
			  document['getElementById']('descriere').innerHTML = "<h1>Nu exista conexiune cu serverul.</h1>";
			  document['getElementById']('safe-sign').remove();
			  document['getElementById']('robot-sign').remove();
			  document['getElementById']('question-sign').remove();
			  document['getElementById']('modalicons').remove();
			  document['getElementById']('grade').remove();
			  document['getElementById']('url').remove();
			  document['getElementById']('warning-sign').style.padding = "25% 0 0 0";
			  body.classList.add("body-gray");
			break;

		case "banned_state":
			//aici nu mai conteaza state
			  document['getElementById']('descriere').innerHTML = "<h1>Accesul tau a fost restrictionat!</h1><h4>Contacteaza-ne la contact@hackout.ro</h4>";
			  document['getElementById']('safe-sign').remove();
			  document['getElementById']('robot-sign').remove();
			  document['getElementById']('question-sign').remove();
			  document['getElementById']('modalicons').remove();
			  document['getElementById']('grade').remove();
			  document['getElementById']('url').remove();
			  document['getElementById']('warning-sign').style.padding = "25% 0 0 0";
			  body.classList.add("body-gray"); 
			break;

		case "clean_state": 
			  state = "clean";
		      console.log("[popup.js]: clean");
			  document['getElementById']('descriere').innerHTML = "Site-ul este sigur!";
			  document['getElementById']('robot-sign').remove();
			  document['getElementById']('warning-sign').remove();
			  document['getElementById']('question-sign').remove();
			  body.classList.add("body-green");
			  break;

		case "malware_state":
			  state = "malware";
		  	  console.log("[popup.js]: malware");
			  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca malware!";
			  document['getElementById']('safe-sign').remove();
			  document['getElementById']('warning-sign').remove();
			  document['getElementById']('question-sign').remove();
			  body.classList.add("body-red");
			break;

		case "fakenews_state":
			  state = "fakenews";
			  console.log("[popup.js]: fakenews");
			  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca fake news!";
			  document['getElementById']('safe-sign').remove();
			  document['getElementById']('robot-sign').remove();
			  document['getElementById']('question-sign').remove();
			  body.classList.add("body-red");
			break;

		case "alt_motiv_state":
			console.log("[popup.js]: ALT_MOTIV_STATE");
			break;

		case "not_reported_state":
			 state = "not_reported";
			  console.log("[popup.js]: nu a fost raportat");
			  document['getElementById']('descriere').innerHTML = "Nu a fost raportat inca! Fii primul care contribuie si voteaza mai jos!";
			  document['getElementById']('warning-sign').remove();
			  document['getElementById']('robot-sign').remove();
			  document['getElementById']('safe-sign').remove();
			  body.classList.add("body-white");
			break;
	}
}


// updatam popup.html in functie de cum a votat
function votedUP() {
	///a votat UP
	var vote_description = document['getElementById']('vote_description');
	document['getElementById']('upvoteButton').style.color = "green";
	document['getElementById']('downvoteButton').style.color = "";
	vote_description.innerHTML = "Ati raportat acest site ca fiind: " +
							"CLEAN" + // aici trebuie creat dinamic
							". Multumim pentru implicare!";
}	

function votedDOWN(issue) {
	///a votat DOWN
	var vote_description = document['getElementById']('vote_description');
	document['getElementById']('upvoteButton').style.color = "";
	document['getElementById']('downvoteButton').style.color = "red";
	vote_description.innerHTML = "Ati raportat acest site ca fiind: " +
							issue + // aici trebuie creat dinamic
							". Multumim pentru implicare!";
}	


// folosesc api de checkvote
function checkVote(){
	chrome.storage.sync.get(['voted', 'domain','value'], function(items) {
		console.log("Received voted response: " + items['voted'] + " " + items['domain'] + " " + items['value']);
		var body = document.body;
		if(items['voted'] === "voted"){
			// punctaj = clean / malware / fakenews
			if(items['value'] === 'clean') {
				voteState = "voted_up;"
				votedUP();
			}
			else {
				voteState = "voted_down";
				votedDOWN(items['value']);
			}
		}
		else//did not vote
			voteState = "not_voted";
	});
}


// post {domain:..., issue:..., reason:...}
function postData(url = '', data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: data,//JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses JSON response into native JavaScript objects 
    //.then(response => console.log("POST: Success"))
    .catch(error => console.error("POST: Error"));
}


// create data for request body
function createDATA(domain, issue, reason){
	return  "domain=" + domain +
			"&issue=" + issue +
			"&reason=" + reason;
}
