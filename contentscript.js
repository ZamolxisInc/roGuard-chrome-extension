var domain = window.location.hostname;
var problema = "malware";//malware/clean/neutru
var punctaj = 10;
var user = '11dsav32f';




if(domain == "zamolxis.org")
{

	chrome.runtime.sendMessage({
    action: 'badWebsite',
    value: problema,
	count: punctaj
	});
	
	showModal(problema);
	
	
}else{
	
	chrome.runtime.sendMessage({
		action: 'badWebiste',
		value: "clean",
		count: punctaj
	});	
	
}

function showModal(problema)
{
	
	//document.body.innerHTML += "
	document.body.innerHTML += '<center><dialog>!!!!!ATENTIE!!!!!<br>Acest website a fost raportat ca: <b>'+problema+'</b><br><br><button>Inchide</button></dialog>';
	var dialog = document.querySelector("dialog");
	dialog.querySelector("button").addEventListener("click", function() {
		dialog.close();
		
	})
	dialog.showModal();

	
}


