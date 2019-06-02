var outUrl;


// first get the windowid
chrome.windows.getCurrent(function(window) {
    // then get the current active tab in that window
    chrome.tabs.query({
        active: true,
        windowId: window.id
    }, function (tabs) {
        var tab = tabs[0];
		var url = new URL(tab.url);
		var domain = url.hostname;
		outUrl = domain;
		document['getElementById']('url').innerHTML = outUrl; 
    });
});







chrome.storage.sync.get(['issue', 'domain','punctaj'], function(items) {
      //document['getElementById']('descriere').innerHTML = items['issue'];
	  //document['getElementById']('url').innerHTML = items['domain'];
	  var body = document.body;
	 //alert(items['punctaj']);
	 if(items['punctaj'] > 0){
		document['getElementById']('myRange').value = items['punctaj'];
	 }else
	 {
		 document['getElementById']('myRange').value = "5";
	 }
	  
	  if(items['issue'] === "fakenews")
	  {
		  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca fake news!";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  body.classList.add("body-red");
		  
	  }else if(items['issue'] === "malware")
	  {
		  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca malware!";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  body.classList.add("body-red");
		 
	
	  }else if(items['issue'] === "clean")
	  {
		  document['getElementById']('descriere').innerHTML = "Site-ul este sigur!";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('question-sign').style.display = "none";
		  body.classList.add("body-green");
		 
		
	  } else {
		  
		  document['getElementById']('descriere').innerHTML = "Nu a fost raportat inca! Fii primul care contribuie si voteaza mai jos!";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  document['getElementById']('safe-sign').style.display = "none";
		  body.classList.add("body-white");
		  
	  }
	  
	  
	  
	  
	  
	  
    });
