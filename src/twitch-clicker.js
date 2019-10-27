// Finds the right element, clicks the bonus button
function clickPoints() {
	try {
        document.querySelector('.community-points-summary').querySelector('button.tw-button').click();
        console.log('Twitch Points Autoclicker: Clicked!');
    }
    catch(err) {}
}

console.log('Twitch Points Autoclicker: Initialized!');

// Pre-check
clickPoints();

// React to creation of an element with the clicking points script
document.arrive('.tw-button', clickPoints);