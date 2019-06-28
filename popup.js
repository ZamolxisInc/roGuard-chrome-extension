var outUrl;


chrome.windows.getCurrent(function(window) {
	//get window id
    // then get the current active tab in that window
    chrome.tabs.query({
        active: true, //get current openned window
        windowId: window.id
    }, function (tabs) {
        var tab = tabs[0];
		var url = new URL(tab.url);
		var domain = url.hostname;
		outUrl = domain;
		document['getElementById']('url').innerHTML = outUrl; 
		// complete the  domain
    });
});



document.addEventListener('DOMContentLoaded', function() {///detecteaza clickul pe voteUp
    var link = document.getElementById('upvoteButton');
    link.addEventListener('click', function() {
        vote(true);///functia e mai jos
    });
});

document.addEventListener('DOMContentLoaded', function() {///detecteaza clickul pe voteDown
    var link = document.getElementById('downvoteButton');
    link.addEventListener('click', function() {
        vote(false);///functia e mai jos
    });
});

///aici facem logica de vot ca sa nu facem cod duplicat
function vote(positive){
	
	if(true)/// TODO - verificam daca IP-ul lui a mai votat domeniul
	{
		if(positive === true)
		{
			///a votat UP
			document['getElementById']('upvoteButton').style.color = "green";
			document['getElementById']('downvoteButton').style.color = "";
			
		}else if(positive === false)
		{
			///a votat DOwn
			document['getElementById']('upvoteButton').style.color = "";
			document['getElementById']('downvoteButton').style.color = "red";
			window.location.href="downvote.html";
		}
			
	}///nu facem else ca daca a votat deja ar trebui sa incarcam pe onLoad la Popup. 
	
}

chrome.storage.sync.get(['issue', 'domain','punctaj'], function(items) {
		// extrag punctajul si issue dupa domain
		 var body = document.body;
		 if(items['punctaj'] != 0){
			document['getElementById']('myRange').value = items['punctaj'];
		 }else
		 {
			 document['getElementById']('myRange').value = "5";
		 }
		
	 
	if (items['issue'] === "no_connection") {
		  document['getElementById']('descriere').innerHTML = "<h1>Nu exista conexiune cu serverul.</h1>";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  document['getElementById']('modalicons').style.display = "none";
		  document['getElementById']('grade').style.display = "none";
		  document['getElementById']('url').style.display = "none";
		  document['getElementById']('warning-sign').style.padding = "25% 0 0 0";
		  body.classList.add("body-gray");
	}
	
		else if(items['issue'] === "banned")
	  {
		  document['getElementById']('descriere').innerHTML = "<h1>Accesul tau a fost restrictionat!</h1><h4>Contacteaza-ne la contact@hackout.ro</h4>";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  document['getElementById']('modalicons').style.display = "none";
		  document['getElementById']('grade').style.display = "none";
		  document['getElementById']('url').style.display = "none";
		  document['getElementById']('warning-sign').style.padding = "25% 0 0 0";
		  body.classList.add("body-gray");
		  
	  }
		else if(items['issue'] === "fakenews")
	  {
		console.log("[popup.js]: fakenews");
		  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca fake news!";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  body.classList.add("body-red");
		  
	  }
		else if(items['issue'] === "malware")
	  {console.log("[popup.js]: malware");
		  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca malware!";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  body.classList.add("body-red");
		 

		}else if(items['issue'] === "clean")
	  {console.log("[popup.js]: clean");
		  document['getElementById']('descriere').innerHTML = "Site-ul este sigur!";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  body.classList.add("body-green");
		 
		
	  } else {
		  console.log("[popup.js]: nu a fost raportat");
		  document['getElementById']('descriere').innerHTML = "Nu a fost raportat inca! Fii primul care contribuie si voteaza mai jos!";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('safe-sign').style.display = "none";
		  body.classList.add("body-white");
		  
	  }
	  
	  
	  
	  
	  
	  
    });
