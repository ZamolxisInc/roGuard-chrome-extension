var outUrl;
var state;
//state il folosim ca sa stim ce elemente sa afisam in functie de issue


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


// check and update state
chrome.storage.sync.get(['issue', 'domain','punctaj'], function(items) {
		// extrag punctajul si issue dupa domain
		 var body = document.body;
		 if(items['punctaj'] != 0)
			 document['getElementById']('myRange').value = items['punctaj'];
		 else
			 document['getElementById']('myRange').value = "5";
		
	 	switch(items['issue']){
	 		// le-am reasezat in changeSTATE
	 		case "no_connection"  : changeState("no_connection_state"); break;
	 		case "banned"         : changeState("banned_state");	    break;
	 		case "fakenews"       : changeState("fakenews_state"); 		break;
	 		case "malware"		  : changeState("malware_state"); 		break;
	 		case "alt_motiv"	  : changeState("alt_motiv_state");		break;
	 		case "clean"		  : changeState("clean_state");			break;
	 		default /*nu a votat*/: changeState("not_reported_state"); 	break;
	 	}

	 	// verificam daca a votat si facem update
	 	//if(checkVoteByIP() === 'up') votedUP(); //a votat up, afisam mesaj
	 	//else if(checkVoteByIP() === "down") votedDOWN;
});




/* ==== Functii ====*/

///aici facem logica de vot ca sa nu facem cod duplicat
function vote(positive){
	if(checkVoteByIP() === "no_vote")/// TODO - verificam daca IP-ul lui a mai votat domeniul
	{
		if(positive === true) 
			votedUP();
		else if(positive === false)
			votedDOWN();
		// votedUP si DOWN trebuie doar sa adauge peste html-ul existent un text		
	}///nu facem else ca daca a votat deja ar trebui sa incarcam pe onLoad la Popup. 	
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



// post {domain:..., issue:..., reason:..., ip:...}
function postData(url = '', data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native JavaScript objects 
}



function checkVoteByIP(){ // TODO: de implementat
	return "no_vote";
	// "up" daca a votat up
	// "down" pentru down
}



function votedUP() {
	///a votat UP
	var descriere = document['getElementById']('descriere');
	document['getElementById']('upvoteButton').style.color = "green";
	document['getElementById']('downvoteButton').style.color = "";
	descriere.innerHTML = "Ati raportat acest site ca fiind: " +
							"CLEAN" + // aici trebuie creat dinamic
							". Multumim pentru implicare!";
}	



function votedDOWN() {
	///a votat DOWN
	document['getElementById']('upvoteButton').style.color = "";
	document['getElementById']('downvoteButton').style.color = "red";
	window.location.href="downvote.html"; //trebuie creat dinamic
	// TODO post req cu vote up pentru domeniul x, ip y, etc
}	

/* TODOS:
	1. api post request pentru voturi
	2. verificam daca a votat: checkVoteByIP()
*/