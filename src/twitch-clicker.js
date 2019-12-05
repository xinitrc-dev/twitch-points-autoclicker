var true_check = false;

// Function to parse points text into a proper integer number
function parsePoints(points_string) {
	// Example string: "29,130 Channel Points"
	// or "29,310 Custom Name"
	
	// Remove , separators from the string
	var cleaned_string = points_string.replace(/,/g, '');
	// Grab part of the string before the first whitespace
	cleaned_string = cleaned_string.substr(0, cleaned_string.indexOf(' '));
	
	var int_result = parseInt(cleaned_string);
	return int_result;
}

// Finds the right element, clicks the bonus button
function clickPoints() {
	try {
		
		// Get all clickable buttons inside 'community-points-summary'
		var elems = document.querySelector('.community-points-summary').querySelectorAll('button');
		
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
					var accumulated_points = (new_points - old_points);

					// Send accumulatedPoints over to background.js to add to the saved value
					if (accumulated_points != 0) {
						updatePoints(accumulated_points);
					}
				}, 5000, old_points);
			}
		});
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