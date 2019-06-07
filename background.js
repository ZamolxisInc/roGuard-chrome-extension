chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	
	
	
    if (msg.action === "badWebsite") {
		
		
		chrome.storage.sync.set({'issue': msg.value, 'domain': 'empty-domain', 'punctaj': msg.count}, function() {
		//
		});
	
		chrome.browserAction.setIcon({path: "/icon/icon-danger.png"});
		
        if (msg.value === "fakenews") 
		{
			
			
			//alert("!!!! ATENTIE !!!!\nWebsite-ul este marcat ca unul fals. Fake news!")
		}
		if (msg.value === "malware") 
		{
			
			
			//alert("!!!! ATENTIE !!!!\nWebsite-ul este unul mailitos! Poate contine virusi!")
		}
    
    } 
	
	if(msg.action === "goodWebsite"){
			
		if (msg.value === "neutru") 
		{
			chrome.storage.sync.set({'issue': msg.value, 'domain': 'empty-domain', 'punctaj': '5'}, function() {
			//
			});
			chrome.browserAction.setIcon({path: "/icon/icon-128.png"});// neutru
			
		}
		
		if (msg.value === "clean") 
		{
			chrome.storage.sync.set({'issue': msg.value, 'domain': 'empty-domain', 'punctaj': msg.count}, function() {
			//
			});
			chrome.browserAction.setIcon({path: "/icon/icon-safe.png"});
			
		}
		
	}
	
	
});




chrome.tabs.onActivated.addListener(function(activeInfo) {

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {

		 chrome.tabs.executeScript({
			file: 'contentscript.js'
		});
	});

});


// chrome.tabs.onCreated.addListener(function() {

	
		 // chrome.tabs.executeScript({
			// file: 'contentscript.js'
		// });
	

// });

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
	 // chrome.tabs.executeScript({
			// file: 'contentscript.js'
		// });

// });





