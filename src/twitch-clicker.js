// Finds the right element, clicks the bonus button
function clickPoints() {
	try {
        // Get all clickable buttons inside 'community-points-summary'
		let elems = document.querySelector('.community-points-summary').querySelectorAll('button');
		
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

setTimeout(function() {
	console.log('Twitch Points Autoclicker: Initialized!');
	const ATTEMPT_NUM = 10;

	(function loopie(i) {
		setTimeout(function() {

			console.log('Twitch Points Autoclicker: Attempt ' + (11 - i) + '/' + ATTEMPT_NUM);

			if (document.contains(document.getElementsByClassName('community-points-summary')[0])) {
				console.log('Twitch Points Autoclicker: Success');

				// Pre-check
				clickPoints();

				// React to creation of an element with the clicking points script
				document.getElementsByClassName('community-points-summary').arrive('button', clickPoints);

				i=1; // equivalent of break

			}

			if (--i) loopie(i);   //  decrement i and call myLoop again if i > 0
		}, 10000)
	})(ATTEMPT_NUM);

}, 10000);