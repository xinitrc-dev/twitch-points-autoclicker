// Check if any Twitch Pages are opened and manually inject twitch-clicker.js if needed
setTimeout(function(){
  console.log('Checking content script status');
  
  // Gets all twitch tabs
  chrome.tabs.query({
  url: '*://*.twitch.tv/*',
  }, function(tabs) {
	console.log(tabs);
	// If no Twitch tabs exist, stop the precheck.
	if (!Array.isArray(tabs) || !tabs.length) {
	  console.log('No matching tabs found.');
	  return null;
	}
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

// Fired when first installed, new extension update or chrome update is installed
chrome.runtime.onInstalled.addListener(function() {
    var firstLaunch;
    var showBrowserNotifications;
    var current_version;
    var last_version;

    chrome.storage.sync.get({
        last_version: null,
        showBrowserNotifications: true
    }, function(items) {
        showBrowserNotifications = items.showBrowserNotifications;
        current_version = chrome.runtime.getManifest().version;

        if (!items.last_version) {
            firstLaunch = true;
            last_version = current_version;
        }
        else {
            firstLaunch = false;
            last_version = items.last_version;
        }

        // Show notifications
        var options = null;
        if (showBrowserNotifications && firstLaunch) {
            options = {
                type: 'basic',
                title: 'New extension installed!',
                message: 'Channel Points Autoclicker has been installed!',
                iconUrl: 'icon128.png',
                buttons: [
					{title: 'View recent updates', iconUrl: 'icons/open.svg'},
					{title: 'Do not show updates', iconUrl: 'icons/no.svg'}
				]
            };
            chrome.notifications.create(options, function (id) {
                updateNotificationID = id;
            });
        }
        if (showBrowserNotifications && (current_version != last_version)) {
            options = {
                type: 'basic',
                title: 'New update available!',
                message: 'Channel Points Autoclicker has been updated to: v' + current_version,
                iconUrl: 'icon128.png',
                buttons: [
					{title: 'View recent updates', iconUrl: 'icons/open.svg'},
                    {title: 'Do not show updates', iconUrl: 'icons/no.svg'}
					]
            };
            chrome.notifications.create(options, function (id) {
                updateNotificationID = id;
            });
        }

        // Save preferences
        chrome.storage.sync.set({
            last_version: current_version,
            showBrowserNotifications: showBrowserNotifications
        }, function(){});
    });
});

// Handle Notification button clicking
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === updateNotificationID) {
        if (btnIdx === 0) {
            chrome.tabs.create({url: chrome.extension.getURL('updates.html')});
            chrome.notifications.clear(notifId);
        } else if (btnIdx === 1) {
            chrome.storage.sync.set({showBrowserNotifications: false}, function(){});
            chrome.notifications.clear(notifId);
        }
    }
});

// Handle content script sending update for bonus points clicks
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.clickedBonusPoints) {
			chrome.storage.sync.get({
                clickedBonusPoints: 0,
			}, function(items) {
                clickedBonusPoints += 1;
				chrome.storage.sync.set({
                    clickedBonusPoints: clickedBonusPoints
				}, function(){});
			});
		}
});

// Handle URL change for Twitch Tabs to prevent bonus points detection from breaking
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) { // indicates the navigation happens in the tab content window, not in a subframe
        if(!(details.url.toUpperCase().indexOf('twitch.tv'.toUpperCase()) !== -1)) {
		// Not a Twitch.tv tab, ignoring
		    return
	    }

        chrome.tabs.sendMessage(details.tabId, {
            urlChanged: 1
        }, function (msg) {
            if (chrome.runtime.lastError) { msg = {}; } else { msg = msg || {}; }
        });
        console.log("onHistoryStateUpdated");
    }
});

// Create popup for the extension button
chrome.browserAction.setPopup({popup: 'popup.html'})