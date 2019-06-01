var domain = window.location.hostname;
var problema = "fakenews";

if(domain == "zamolxis.org")
{

	chrome.runtime.sendMessage({
    action: 'badWebsite',
    value: problema
	});
	
}else{
	
	chrome.runtime.sendMessage({
		action: 'badWebiste',
		value: "clean"
	});	
	
}


