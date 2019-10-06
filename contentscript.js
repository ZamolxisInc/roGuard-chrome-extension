var domain = window.location.hostname;
var problema;//malware/clean/neutru/fakenews
var punctaj;
var reason;
var dataCalendar;
var isIssueReceived;
var showAlertsVar = checkShowAlerts();
var bleeding_value = "nothing";
var allow = "show";


// api check domain
getData('https://roguard.hackout.ro/api/checkDomain/' + domain)
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
						bleeding_value = "badWebsite";

						showModal(problema);	
				}

				else if(isIssueReceived === 0){
					chrome.runtime.sendMessage({
						action: 'goodWebsite',
						value: problema,
						count: punctaj
					});	
					bleeding_value = "goodWebsite";
				}
				}) // JSON-string from `response.json()` call
  .catch(error => console.error(error));


// api CHECK VOTE
getData('https://roguard.hackout.ro/api/checkVote/' + domain)
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


function showModal(problema) {
	// document.body.innerHTML += '<center><dialog>!!!!!ATENTIE!!!!!<br>Acest website a fost raportat ca: <b>'+problema+'</b><br><br><button>Inchide</button></dialog>';
	// var dialog = document.querySelector("dialog");
	// dialog.querySelector("button").addEventListener("click", function() {
	// 	dialog.close();		
	// })
	//dialog.show();
	if (checkShowAlerts() == "show") {
		//alert("[RoGuard] : Site-ul poate fi periculos ! Daca ati fost redirectionat, inchideti tab-ul curent");
		createWarning();
	}
	//commented for testing
}


// under dev ...
function bleedingscreen(value) {
	if ( checkShowAlerts() == "show" ) {
		// inject css
		var link = document.createElement("link");
		link.href = "bleeding-screen.css";
		//link.type = "text/css";
		link.rel = "stylesheet";
		window.onload = function() {
			document.getElementsByTagName("head")[0].appendChild(link);

			if (value == "goodWebsite") {
				// todo css : add _green class
				document.body.className += " " + "bleeding-green";
			} else if (value == "badWebsite") {
				// todo css : add _red class
				document.body.className += " " + "bleeding-red";
			}
		}
	}	
}

function checkShowAlerts() {
	chrome.storage.sync.get( "alerts" , (allow_) => {
		if (allow != undefined && allow != null) allow = allow_.alerts;
	}); 
	if (allow == "show" || allow == "not_show") 
		return allow;
	else return "error"; 
}

function insertCSS() {
	var toBeInserted = ".w3-modal { display: block; position: fixed; /* Stay in place */  z-index: 1; /* Sit on top */  padding-top: 100px; /* Location of the box */  left: 0;  top: 0;  width: 100%; /* Full width */  height: 100%; /* Full height */  overflow: auto; /* Enable scroll if needed */  background-color: rgb(0,0,0); /* Fallback color */  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */}  /* Modal Content */.modal-content {  background-color: #fefefe;  margin: auto;  padding: 20px;  border: 1px solid #888;  width: 80%;} .header-content {height: 30%;} .w3-container{padding:0.01em 3px}.w3-display-container:hover .w3-display-hover{display:block}.w3-display-container:hover span.w3-display-hover{display:inline-block}.w3-display-hover{display:none}.w3-tooltip,.w3-display-container{position:relative}.w3-tooltip .w3-text{display:none}.w3-tooltip:hover .w3-text{display:inline-block}.w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row:after,.w3-row:before,.w3-row-padding:after,.w3-row-padding:before,.w3-red,.w3-hover-red:hover{color:#fff!important;background-color:#f44336!important}.w3-modal-content{margin:auto;background-color:#fff;position:relative;padding:0;outline:0;width:600px}.w3-animate-top{position:relative;animation:animatetop 0.4s}@keyframes animatetop{from{top:-300px;opacity:0} to{top:0;opacity:1}}.w3-card-4,.w3-hover-shadow:hover{box-shadow:0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19)}/* BUTTON */.w3-display-topright{position:absolute;right:0;top:0}.w3-xlarge{font-size:24px!important}.w3-xxlarge{font-size:36px!important}.w3-xxxlarge{font-size:48px!important}.w3-jumbo{font-size:64px!important}.w3-button{border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; white-space: normal;}.footer-content{color:#fff!important;background-color:#010749!important}";
	var styleSheet = document.createElement("style");
	styleSheet.type = "text/css";
	styleSheet.innerText = toBeInserted;
	document.head.appendChild(styleSheet);
}

function insertJS() {
	var toBeInserted = " var modal = document.getElementById('id01'); document.getElementById('closeButton').onclick = function(){ console.log('clicked'); modal.style.display='none';};";
	var JS= document.createElement('script');
    JS.text= toBeInserted;
    document.body.appendChild(JS);	
}

function insertHTML() {
	var toBeInserted = '<div id="id01" class="w3-modal">  <div class="w3-modal-content w3-animate-top w3-card-4"> <header class="w3-container w3-red"> <span id="closeButton" class="w3-button w3-xlarge w3-display-topright w3-hover-red w3-hover-opacity">×</span>      <h2 align="center">Atentie !</h2>    </header>    <div class="w3-container">      <p align="center" font-family="Times New Roma">Site-ul accesat poate fi periculos !<br><br></p>  <p style="left:0; bottom:0; size:5px;  font-style: italic; font-size:12px;">Navigheaza in siguranta cu <a font-family="Arial Black" font-style="normal">roGuard</a></p>    </div>    <!-- <footer class="w3-container footer-content">      <p>Modal Footer</p>   </footer> -->  </div></div>';
	document.body.innerHTML = toBeInserted + document.body.innerHTML;
}

function createWarning() {
	insertHTML();
	console.log("HTML inserted");
	insertCSS();
	console.log("CSS inserted");
	insertJS();
	console.log("JS inserted");
}