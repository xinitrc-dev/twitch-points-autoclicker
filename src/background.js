setTimeout(function(){
  console.log('Checking content script status');
  
  // Gets all twitch tabs
  chrome.tabs.query({
  url: '*://*.twitch.tv/*',
  }, function(tabs) {
	tabs.forEach(function(tab) {
	  // Initializes handshake with potential twitch-clicker.js script inside the tab
	  chrome.tabs.sendMessage(tab.id, {text: 'check'}, function(msg) {
	    if(chrome.runtime.lastError) { msg = {}; }
	    else { msg = msg || {}; }
		
		// If handshake fails (twitch-clicker.js doesn't exist in the tab) - inject the main script and its reverse dependency
	    if (msg.status != 'confirmed') {
		  chrome.tabs.executeScript(tab.id, {file: 'arrive-2.4.1.min.js'});
		  chrome.tabs.executeScript(tab.id, {file: 'twitch-clicker.js'});
	    }});  
	});
})}, 1000);