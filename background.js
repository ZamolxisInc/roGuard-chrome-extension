chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	// new message about a domain
	if(msg.action === "no_connection") {
		chrome.storage.sync.set(
			{'issue': "no_connection", 'domain': 'empty-domain', 'punctaj': msg.count}, function() {});
	
		chrome.browserAction.setIcon({path: "/icon/icon-gray.png"});
	}
	
	if(msg.action === "banned") {
		chrome.storage.sync.set(
			{'issue': "banned", 'domain': 'empty-domain', 'punctaj': '5'}, function() {});
	
		chrome.browserAction.setIcon({path: "/icon/icon-gray.png"});
	}

    if (msg.action === "badWebsite") {	
		chrome.storage.sync.set(
			{'issue': msg.value, 'domain': 'empty-domain', 'punctaj': msg.count}, function() {});
	
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
			chrome.storage.sync.set(
				{'issue': msg.value, 'domain': 'empty-domain', 'punctaj': '5'}, function() {});
			chrome.browserAction.setIcon({path: "/icon/icon-128.png"});// neutru
		}
		
		if (msg.value === "clean") 
		{
			chrome.storage.sync.set(
				{'issue': msg.value, 'domain': 'empty-domain', 'punctaj': msg.count}, function() {});
			chrome.browserAction.setIcon({path: "/icon/icon-safe.png"});	
		}	
	}

	// new message that tells us if user voted already
	// punem: voted = voted/not_voted; value=up/down/0
	if(msg.action === "voted") {
		//alert("Received message:" + "action=" + msg.action + " value=" + msg.value);
		chrome.storage.sync.set({'voted': "voted", 'domain': 'empty-domain', 'value': msg.value}, function() {});
	}
	else if(msg.action === "not_voted"){
		//alert("NO VOTED message:" + "action=" + msg.action + " value=" + msg.value);
		chrome.storage.sync.set({'voted': "not_voted", 'domain': 'empty-domain', 'value': msg.value}, function() {});
	}
});




chrome.tabs.onActivated.addListener(function(activeInfo) {
	// am intrat pe un now tab
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {


	chrome.tabs.executeScript({
			file: 'contentscript.js' // asta e ca sa se schimbe iconul cand schimb tabul
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





