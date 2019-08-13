/*TODOs
1. votez up/down si imediat dupa vreau sa schimb, nu merge
2. cand site-ul e neutru se vede meniul
3. bug la alt_motiv*/
var outUrl;
var state;
var voteState = "not_voted";//voted_up voted_down sau not_voted
// state il folosim ca sa stim ce elemente sa afisam in functie de issue
// votestate il folosim ca sa retinem dupa ce facem checkVote daca a votat
contorVotUP = 0;
contorVotDOWN = 0;
 
/* domeniul ce apare sus in popup - domain grab by chr*/
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
	     if (voteState === "not_voted"){
               vote(true);
	     }else if(voteState === "voted_down"){
               var vote_description = document['getElementById']('vote_description').innerHTML = "Ai votat deja! Esti sigur ca vrei sa schimbi votul?";
               contorVotUP++;
               if(contorVotUP >= 2)
               {
                              var vote_description = document['getElementById']('vote_description').innerHTML = "Votul tau a fost schimbat!";
                              vote(true);
                              votedUP();
               }
	     }
    });
});
 
document.addEventListener('DOMContentLoaded', function() {///detecteaza clickul pe voteDown
    var link = document.getElementById('downvoteButton');
    link.addEventListener('click', function() {
         if (voteState === "not_voted"){
               vote(false);
         }else if(voteState === "voted_up"){        
               var vote_description = document['getElementById']('vote_description').innerHTML = "Ai votat deja! Esti sigur ca vrei sa schimbi votul?";
               contorVotDOWN++;
               if(contorVotDOWN >= 2)
               {
                  window.location.href="downvote.html";
                  var vote_description = document['getElementById']('vote_description').innerHTML = "Votul tau a fost schimbat!";
                  votedDOWN("periculos");
                  vote(false);
               }
         }
    });     
});
 
document.addEventListener('DOMContentLoaded', function() {
    var link2 = document.getElementById('settingsIcon');
    link2.addEventListener('click', changeNav);    
});
 
 
/*-- SYNC --*/
// check and update state
chrome.storage.sync.get(['issue', 'domain','punctaj'], function(items) {
     // extrag punctajul si issue dupa domain
     var body = document.body;
     if(items['punctaj'] != 0){
                  //document['getElementById']('myRange').value = items['punctaj'];
                   barFunction( 1 - (items['punctaj']/10) );
     }
     else{
                  //document['getElementById']('myRange').value = "5";
                   barFunction(0.5);
     }
   switch(items['issue']) {
      // le-am reasezat in changeSTATE
      case "no_connection"  : changeState("no_connection_state"); 			break;
      case "banned"         : changeState("banned_state");                  break;
      case "fakenews"       : changeState("fakenews_state");                break;
      case "malware"        : changeState("malware_state");       			break;
      case "alt_motiv"      : changeState("alt_motiv_state");               break;
      case "clean"          : changeState("clean_state");                   break;
      default /*nu a votat*/: changeState("neutral_state");                 break;
   }
});
 
// check if user voted this domain before
checkVote();
// folosesc api de checkvote la pornire ca sa modificam butoanele in functie de votat sau nu deja
function checkVote(){
	  chrome.storage.sync.get(['voted', 'domain','value'], function(items) {
	     var body = document.body;
	     if(items['voted'] === "voted"){
	       if(items['value'] === 'clean') {
	                      voteState = "voted_up";
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
 
 
/* ==== Functii ====*/
function vote(positive){//functia care se apeleaza la apasarea butoanelor
	  if(positive === true) {
         if (voteState === "voted_down" || voteState === "not_voted"){//adica daca nu a votat sau a votat altceva
               // logica pentru sendVote(voteup);
               var data = "domain=" + outUrl +
                          "&issue=" + "clean" +
                          "&reason=" + "";
               var url = 'https://roguard.hackout.ro/api/voteDomain/';
               try{
                  postData(url, data)
                  .then(data => { votedUP(); });
               }catch(error){
                  alert("Vote up FAILED");
               }
         }
         votedUP();
         refreshPage();
         // else nu mai afisam nimic daca apasa pe UP si votase deja up
	  }
	  else if(positive === false){
         window.location.href="downvote.html";
         votedDOWN();
	  }
	  // votedUP si DOWN trebuie doar sa adauge peste html-ul existent un text      
	  checkVote();     
}
 
 
 
// schimb state-ul in functie de issue
function changeState(param){
  // in functe de param stim cum sa arate popup.html
  var body = document.body;
  switch(param) {
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
                     //body.classList.add("body-gray");
                     document.getElementById("modalcontent").classList.add("body-gray");
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
                     //body.classList.add("body-gray");
                     document.getElementById("modalcontent").classList.add("body-gray");
                   break;

     case "clean_state":
                     state = "clean";
                     document['getElementById']('descriere').innerHTML = "Site-ul este sigur!";
                     document['getElementById']('robot-sign').remove();
                     document['getElementById']('warning-sign').remove();
                     document['getElementById']('question-sign').remove();
                     // body.classList.add("body-green");
                     document.getElementById("modalcontent").classList.add("body-green");
                     break;

     case "malware_state":
                     state = "malware";
                     document['getElementById']('descriere').innerHTML = "Site-ul poate contine virusi/malware!";
                     document['getElementById']('safe-sign').remove();
                     document['getElementById']('warning-sign').remove();
                     document['getElementById']('question-sign').remove();
                     //body.classList.add("body-red");
                     document.getElementById("modalcontent").classList.add("body-red");
                   break;

     case "fakenews_state":
                     state = "fakenews";
                     document['getElementById']('descriere').innerHTML = "Site-ul poate contine stiri false!";
                     document['getElementById']('safe-sign').remove();
                     document['getElementById']('robot-sign').remove();
                     document['getElementById']('question-sign').remove();
                     //body.classList.add("body-red");
                     document.getElementById("modalcontent").classList.add("body-red");
                   break;

     case "alt_motiv_state":
                   // TODO
                   break;

     case "neutral_state":
                   state = "neutral_state";
                     document['getElementById']('descriere').innerHTML = "Site-ul este NEUTRU.";
                     document['getElementById']('warning-sign').remove();
                     document['getElementById']('robot-sign').remove();
                     document['getElementById']('safe-sign').remove();
                     document['getElementById']('question-sign').remove();
                     //body.classList.add("body-white");
                   break;
	}
}
 
 
// updatam popup.html in functie de cum a votat
function votedUP() {
	  //a votat UP
	  var vote_description = document['getElementById']('vote_description');
	  document['getElementById']('upvoteButton').style.color = "green";
	  document['getElementById']('downvoteButton').style.color = "";
	  vote_description.innerHTML = "Ati raportat acest site ca fiind: " +
                                 "LEGITIM" ; // aici trebuie creat dinamic;
}            
 
function votedDOWN(issue) {
	  //a votat DOWN
	  var vote_description = document['getElementById']('vote_description');
	  document['getElementById']('upvoteButton').style.color = "";
	  document['getElementById']('downvoteButton').style.color = "red";
	  vote_description.innerHTML = "Ati raportat acest site ca fiind: " +
                                     issue; // aici trebuie creat dinamic
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
 
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
 
function refreshPage(){
  sleep(1000);
  chrome.tabs.getSelected(null, function(tab) {
    var code = 'window.location.reload();';
    chrome.tabs.executeScript(tab.id, {code: code});
  });
  window.close();
}
 
 
// bar functionality here
function barFunction(value) {
              var bar = new ProgressBar.SemiCircle(document.getElementById('container'), {
                strokeWidth: 6,
                color: '#FFEA82',
                trailColor: '#eee',
                trailWidth: 1,
                easing: 'easeInOut',
                duration: 750,
                svgStyle: null,
                text: {
                  value: '',
                  alignToBottom: false
                },
                from: {color: '#ff0000'},
                to: {color: '#7FFF00'},
                // Set default step function for all animate calls
                step: (state, bar) => {
                  bar.path.setAttribute('stroke', state.color);
                  var value = Math.round(bar.value() * 100);
                  if(0 < value && value < 20){
                            bar.setText("Foarte periculos!");
                  }
                                           else if(20 <= value && value < 40){
                    bar.setText("Periculos!");
                  }
                  else if(40 <= value && value < 55){
                            bar.setText("Mediu!");
                  }
                  else if(55 <= value && value < 80){
                    bar.setText("Ok!");
                  }
                  else{
                     bar.setText("Safe!");
                  }
                  bar.text.style.color = state.color;
                }
              });
              bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
              bar.text.style.fontSize = '2rem';
 
              bar.set(0);
              bar.animate(value);  // Number from 0.0 to 1.0
}
 
 
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("topNav").style.height = "50px";
  document.getElementById("modalcontent").style.marginTop = "5px";
}
 
/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("topNav").style.height = "0px";
  document.getElementById("modalcontent").style.marginTop = "0";
}
 
function changeNav() {
              console.log("changeNav: topNav height: " + document.getElementById("topNav").style.height);
              if (document.getElementById("topNav").style.height == "50px" ) {
                             closeNav();
              }
              else openNav();
}

function changeTheme(theme) {
              // TODO
}