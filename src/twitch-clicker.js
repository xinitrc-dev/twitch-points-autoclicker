var true_check = false;

// Finds the right element, clicks the bonus button
function clickPoints() {
	console.log('Element detected.')
	
	// Get all clickable buttons inside 'community-points-summary'
	var elems = document.querySelector('.community-points-summary').querySelectorAll('button');
	
	// Click each button, except for the first, which is the points spending menu
	elems.forEach(function(currentElem, index, arr) {
		if (index != 0) {
			// Click the button and display the console log
			console.log('Twitch Points Autoclicker: Clicked!');
			currentElem.click();
			
			// Record the collection to the storage
			updateClicks();
		}
	});
}

function updateClicks() {
	chrome.runtime.sendMessage({clickedBonusPoints: 1}, function(response) {
		if(chrome.runtime.lastError) { msg = {}; }
	    else { msg = msg || {}; }
	});
}

// Check if user is opted into hiding bonus chests and hide them accordingly
function hideBonusPointsSection() {
	chrome.storage.sync.get({
		hideBonusChests: false,
	}, function(items) {
		var hideBonusChests = items.hideBonusChests;

		if (hideBonusChests) {
			var value = "none";
		}
		else {
			var value = "block";
		}
		
		if (document.body.contains(document.getElementsByClassName('community-points-summary')[0])) {
			// Chests themselves
			document.getElementsByClassName('community-points-summary')[0].children[1].style.display = value;
			// Floaty +50 text
			document.getElementsByClassName('community-points-summary')[0].children[0].children[3].style.display = value;
		}
	});
}

//Answer background.js handshake
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'check') {
		sendResponse({status: 'confirmed'});
    }
	if ('hideBonusChests' in msg) {
		sendResponse({status: 'ok'});
		hideBonusPointsSection();
	}
	if ('urlChanged' in msg) {
		true_check = true;
		setTimeout(checkPage, 5000);
		sendResponse({status: 'ok'})
	}
});

function checkPage() {
	// Prevent firing script upon simultaneous redirects and fast page switching
	if (!true_check) { return }
	true_check = false;
	
	Arrive.unbindAllArrive();
	
	if (document.body.contains(document.getElementsByClassName('community-points-summary')[0])) {
		// Presumably on a channel page that already contains the points section div
		console.log('Detected inside of a channel page.');

		// Pre-check
		clickPoints();
		
		hideBonusPointsSection();

		document.getElementsByClassName('community-points-summary').arrive('button', clickPoints);
	}
	else {
		// Presumably outside of a channel page
		console.log('Detected outside of a channel page.');
	}
}

// Run main functions after 10 second delay to let other extensions load and potentially modify HTML
function main() {
	setTimeout(function() {
		console.log('Twitch Points Autoclicker: Initialized!');

		true_check = true;
		checkPage();
	}, 10000);
}

main();
