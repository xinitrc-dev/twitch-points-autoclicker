function getClaimButton() {
	return document.querySelector('.claimable-bonus__icon') && document.querySelector('.claimable-bonus__icon').closest('button');
}

// Finds the right element, clicks the bonus button
function clickPoints() {
	let button = getClaimButton();
	if (button) {
		console.log('Twitch Points Autoclicker: Clicked!');
		button.click();
	}
}

setTimeout(function() {
	console.log('Twitch Points Autoclicker: Initialized!');

	// Pre-check
	let try_button = getClaimButton();
	if (try_button) {
		console.log('Twitch Points Autoclicker: Found Button!');

		clickPoints();
	}

	// React to creation of an element with the clicking points script
	document.arrive('.claimable-bonus__icon', function() {
		console.log('Twitch Points Autoclicker: Found Button!');
		clickPoints();
	});
	
}, 10000);