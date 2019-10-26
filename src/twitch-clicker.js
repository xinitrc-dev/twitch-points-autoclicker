console.log('Twitch Points Autoclicker: Initialized!');

// Finds the right element, clicks the bonus button
function clickPoints() {
	try {
        document.querySelector('.community-points-summary').querySelector('button.tw-button').click();
        console.log('Twitch Points Autoclicker: Clicked!');
    }
    catch(err) {}
}

// Pre-check
clickPoints();

//Answer background.js handshake
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	console.log(msg.text);
    if (msg.text === 'check') {
      sendResponse({status: 'confirmed'});
    }
});

// React to creation of an element with the clicking points script
document.arrive('.tw-button', clickPoints);