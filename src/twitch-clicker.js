// Function to parse points text into a proper integer number
function parsePoints(points_string) {
	// Example string: "29,130 Channel Points"
	points_string = points_string.slice(0, -15);
	var cleaned_string = points_string.replace(/,/g, '');
	
	var int_result = parseInt(cleaned_string);
	return int_result;
}

// Finds the right element, clicks the bonus button
function clickPoints() {
	var accumulated_points = 0;
	
	try {
		
		// Get all clickable buttons inside 'community-points-summary'
		var elems = document.querySelector('.community-points-summary').querySelectorAll('button.tw-interactive');
		
		// Click each button, except for the first, which is the points spending menu
		// Record the point balance change as well
		elems.forEach(function(currentElem, index, arr) {
			if (index != 0) {
				// Record Balance pre-click
				var old_points = parsePoints(document.getElementsByClassName('community-points-summary')[0].children[0].children[1].children[1].textContent);
				
				// Click the button and display the console log
				console.log('Twitch Points Autoclicker: Clicked!');
				currentElem.click();
				
				// Record Balance post-click and save the difference
				setTimeout(function(old_points) {
					var new_points = parsePoints(document.getElementsByClassName('community-points-summary')[0].children[0].children[1].children[1].textContent);
					accumulated_points += (new_points - old_points);
				}, 5000, old_points);
			}
		});
		// Send accumulatedPoints over to background.js to add to the saved value
		setTimeout(function() {
			if (accumulated_points != 0) {
				updatePoints(accumulated_points);
			}
		}, 7000);
    }
    catch(err) {}
}

function updatePoints(accumulatedPoints) {
	accumulatedPoints = parseInt(accumulatedPoints);
	chrome.runtime.sendMessage({accumulatedChannelPoints: accumulatedPoints}, function(response) {
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
		var value;
		if (hideBonusChests) {
			value = "none";
		}
		else {
			value = "block";
		}
		// Chests themselves
		document.getElementsByClassName('community-points-summary')[0].children[1].style.display = value;
		// Floaty +50 text
		document.getElementsByClassName('community-points-summary')[0].children[0].children[3].style.display = value;
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
});

// Run main functions after 30 second delay to let other extensions load and potentially modify HTML
function main() {
	document.getElementsByClassName('community-points-summary').unbindArrive('button.tw-interactive');

	setTimeout(function() {
		// Pre-check
		clickPoints();

		// React to creation of an element with the clicking points script
		document.getElementsByClassName('community-points-summary').arrive('button.tw-interactive', clickPoints);
		
		hideBonusPointsSection();
	}, 10000);
}

console.log('Twitch Points Autoclicker: Initialized!');
main();