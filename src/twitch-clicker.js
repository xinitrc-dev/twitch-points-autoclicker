var true_check = false;

function getClaimButton() {
	return document.querySelector('.claimable-bonus__icon') && document.querySelector('.claimable-bonus__icon').closest('button');
}

function clickPoints() {
	var button = getClaimButton();
	if (button) {
		console.log('Twitch Points Autoclicker: Clicked!');
		button.click();
		updateClicks();
	}
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
		var value = hideBonusChests ? "none" : "block";

		var cps = document.getElementsByClassName('community-points-summary')[0];
		if (cps && document.body.contains(cps)) {
			// Chests themselves
			if (cps.children[1]) cps.children[1].style.display = value;
			// Floaty +50 text
			if (cps.children[0] && cps.children[0].children[3]) cps.children[0].children[3].style.display = value;
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
	if (!true_check) { return }
	true_check = false;

	Arrive.unbindAllArrive();

	if (document.body.contains(document.getElementsByClassName('community-points-summary')[0])) {
		console.log('Detected inside of a channel page.');

		clickPoints();

		hideBonusPointsSection();

		document.arrive('.claimable-bonus__icon', function() {
			clickPoints();
		});
	}
	else {
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
