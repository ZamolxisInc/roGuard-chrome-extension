// aici facem logica pentru ce se intampla cand apasam TRIMITE in downvote.html 
/* TODO
`1. punem event listener cand da click
`2. facem post request pe voteDomain
`3. verificam raspunsul: 
`3.1. daca e ok, trecem inapoi la popup.html
!-3.2. daca nu e ok, afisam un mesaj si lasam userul sa mai incerce o data SAU
sa revina la popup.html cand apasa X
4. cand revenim in popup.html se va face iar sync si in extensie va aparea votul schimbat
*/
var domainOut;

//get domain name:
chrome.windows.getCurrent(function(window) {
    chrome.tabs.query({
        active: true, //get current openned window
        windowId: window.id
    }, function (tabs) {
        var tab = tabs[0];
		var url = new URL(tab.url);
		var domain = url.hostname;
		domainOut = domain;
    });
});


// add listener: TRIMITE
document.addEventListener('DOMContentLoaded', function() {///detecteaza clickul pe voteUp
    var link = document.getElementById('confirm-downvote-button');
    link.addEventListener('click', function() {
	    	// luam optiunea issue
	    	var selElem = document.getElementById("selectBox");
	        var issue = selElem.options[ selElem.selectedIndex ].value;
	        // create the url and data:
			var data = createDATA(domainOut, issue, "");
			var url = 'https://roguard.hackout.ro/api/voteDomain/';
			// send the post request and check the response:
			try{
				postData(url, data)
					.then(data => {
						alert("We have registred your vote !!!!!");
                    })
			}
			catch(error){ 
				alert("Post failed. Returning to initial page..."); 
			}
			// revenim la html-ul initial
			location.href="popup.html";

    });
});










/*===== FUNCTIONS =====*/
function createDATA(domain, issue, reason){
	return  "domain=" + domain +
			"&issue=" + issue +
			"&reason=" + reason;
    // return  {"domain": domain, 
    //  "issue" : issue, 
    //  "reason": reason}
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
    .catch(error => console.error("POST: Failed to send post request to server"));
}