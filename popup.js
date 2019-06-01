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




chrome.storage.sync.get(['issue', 'domain'], function(items) {
      //document['getElementById']('descriere').innerHTML = items['issue'];
	  //document['getElementById']('url').innerHTML = items['domain'];
	  var body = document.body;

		;
	  
	  
	  if(items['issue'] === "fakenews")
	  {
		  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca fake news!";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  body.classList.add("body-red")
		  
	  }else if(items['issue'] === "malware")
	  {
		  document['getElementById']('descriere').innerHTML = "Site-ul a fost raportat ca malware!";
		  document['getElementById']('safe-sign').style.display = "none";
		  document['getElementById']('warning-sign').style.display = "none";
		  body.classList.add("body-red")
		 
		
	  } else {
		  
		  document['getElementById']('descriere').innerHTML = "Site-ul nu a fost raportat!";
		  document['getElementById']('warning-sign').style.display = "none";
		  document['getElementById']('robot-sign').style.display = "none";
		  body.classList.add("body-green");
		
		  
	  }
	  
    });
