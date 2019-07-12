var domain = window.location.hostname;
var problema;//malware/clean/neutru/fakenews
var punctaj;
var reason;
var dataCalendar;
var isIssueReceived;

// get json response
function getData(url = '') {
    return fetch(url, {
    	// ask server the check the domain
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects 
}


// api check domain
getData('https://roguard.hackout.ro/checkDomain/' + domain)
  .then(data => {
				//console.log(JSON.stringify(data));
				var problema = data.problema;
				var punctaj = data.count;
				var reason = data.reason;
				var dataCalendar = data.datac;
				var isIssueReceived = data.isIssue;
				var connection = data.connection;
				var banned = data.banned;
				
				if(connection === "failed"){
					// trimitem la background.js 'no connection'
					chrome.runtime.sendMessage({
						action: 'no_connection', // de aduagat Cleean - apare modal pe clean - scos in alt message
						value: problema,
						count: punctaj
						});
				}
				
				else if(banned === true)
				{
					chrome.runtime.sendMessage({
						action: 'banned',
						value: 'bannedvalue',
						count: '5'
					});
				}
				else if(isIssueReceived === 1 && (problema === "fakenews" || problema === "malware"))
					{
						chrome.runtime.sendMessage({
							action: 'badWebsite', // de aduagat Cleean - apare modal pe clean - scos in alt message
							value: problema,
							count: punctaj
						});
						
						showModal(problema);	
					}

				else if(isIssueReceived === 0){
					chrome.runtime.sendMessage({
						action: 'goodWebsite',
						value: problema,
						count: punctaj
					});	
				}
				// else { // daca serverul nu e pornit popup tot afiseaza ca si cum ar fi ok
				// 	console.log("Connection ERROR.");
				// 	// trimitem la background.js 'no connection'
				// 	chrome.runtime.sendMessage({
				// 		action: 'no_connection', 
				// 		value: problema,
				// 		count: punctaj
				// 		});
				// }
				}) // JSON-string from `response.json()` call
  .catch(error => console.error(error));
  


// api CHECK VOTE
getData('https://roguard.hackout.ro/checkVote/' + domain)
  .then(data => 
   {
  				var connection = data.connection;
				var voted = data.voted; 	// poate fi true/false
				var issue = data.problema;  // clean/neutru/malware/fakenews

				if(connection === false){ // no_connection
					chrome.runtime.sendMessage({
						action: 'no_connection',
						value: issue // trimitem ca 'value' ce a votat
					});
				}
				// verificam INDEPENDENT daca a votat deja si trimitem intr-un nou message:
				else if(voted === true){ // daca a votat deja
					chrome.runtime.sendMessage({
						action: 'voted',
						value: issue // trimitem ca 'value' ce a votat
					});
				}
				else{
					chrome.runtime.sendMessage({
						action: 'not_voted',
						value: 0
					});
				}
	}) // JSON-string from `response.json()` call
  .catch(error => console.error(error));
  



function showModal(problema) {
	//document.body.innerHTML += "
	document.body.innerHTML += '<center><dialog>!!!!!ATENTIE!!!!!<br>Acest website a fost raportat ca: <b>'+problema+'</b><br><br><button>Inchide</button></dialog>';
	var dialog = document.querySelector("dialog");
	dialog.querySelector("button").addEventListener("click", function() {
		dialog.close();
		
	})
	//dialog.showModal();	
	//commented for testing
}



// function getLocalIPs(callback) {
    // var ips = [];

    // var RTCPeerConnection = window.RTCPeerConnection ||
        // window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    // var pc = new RTCPeerConnection({
        // // Don't specify any stun/turn servers, otherwise you will
        // // also find your public IP addresses.
        // iceServers: []
    // });
    // // Add a media line, this is needed to activate candidate gathering.
    // pc.createDataChannel('');
    
    // // onicecandidate is triggered whenever a candidate has been found.
    // pc.onicecandidate = function(e) {
        // if (!e.candidate) { // Candidate gathering completed.
            // pc.close();
            // callback(ips);
            // return;
        // }
        // var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        // if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            // ips.push(ip);
    // };
    // pc.createOffer(function(sdp) {
        // pc.setLocalDescription(sdp);
    // }, function onerror() {});
// }

// getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
    // document.body.textContent = 'Local IP addresses:\n ' + ips.join('\n ');
// });

