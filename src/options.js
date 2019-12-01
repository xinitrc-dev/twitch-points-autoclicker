// Saves options to chrome.storage
function save_options() {
    var showBrowserNotifications = document.getElementById('showBrowserNotifications').checked;
    var showAccumulatedPoints = document.getElementById('showAccumulatedPoints').checked;
    var hideBonusChests = document.getElementById('hideBonusChests').checked;

    chrome.storage.sync.set({
        showBrowserNotifications: showBrowserNotifications,
        showAccumulatedPoints: showAccumulatedPoints,
        hideBonusChests: hideBonusChests,
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved!';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
	
	// Gets all twitch tabs
	chrome.tabs.query({
		url: '*://*.twitch.tv/*',
	}, function(tabs) {
		// If no Twitch tabs exist, stop the precheck.
		if (!Array.isArray(tabs) || !tabs.length) {
		  return null;
		}
		tabs.forEach(function(tab) {
			// Initializes handshake with potential twitch-clicker.js script inside the tab
			chrome.tabs.sendMessage(tab.id, {hideBonusChests: hideBonusChests}, function(msg) {
				if(chrome.runtime.lastError) { msg = {}; }
				else { msg = msg || {}; }
				
			});
		});
	});
}

// Restores Options state using the preferences saved in chrome.storage
function restore_options() {
    chrome.storage.sync.get({
        showBrowserNotifications: true,
        showAccumulatedPoints: false,
        hideBonusChests: false,
    }, function(items) {
        document.getElementById('showBrowserNotifications').checked = items.showBrowserNotifications;
        document.getElementById('showAccumulatedPoints').checked = items.showAccumulatedPoints;
        document.getElementById('hideBonusChests').checked = items.hideBonusChests;
    });
}

// Creates a new tab with extension updates log
function open_updates() {
    chrome.tabs.create({url: chrome.extension.getURL('updates.html')});
}

// Main loady thingy
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('updates').addEventListener('click', open_updates);
document.getElementById('save').addEventListener('click', save_options);