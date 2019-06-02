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
	
}else{
	
	chrome.runtime.sendMessage({
		action: 'badWebiste',
		value: "clean",
		count: punctaj
	});	
	
}


