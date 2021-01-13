// Finds the right element, clicks the bonus button
function clickPoints() {
	try {
        // Get all clickable buttons inside 'community-points-summary'
		var elems = document.querySelector('.community-points-summary').querySelectorAll('button');
		
		// Click each button, except for the first, which is the points spending menu
		elems.forEach(function(currentElem, index, arr) {
			if (index != 0) {
				// Click the button and display the console log
				console.log('Twitch Points Autoclicker: Clicked!');
				currentElem.click();
			}
		});
    }
    catch(err) {}
	
}

console.log('Twitch Points Autoclicker: Initialized!');

// Pre-check
clickPoints();

// React to creation of an element with the clicking points script
document.getElementsByClassName('community-points-summary').arrive('button', clickPoints);