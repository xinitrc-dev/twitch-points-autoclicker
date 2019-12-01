function open_settings() {
    chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

document.addEventListener('DOMContentLoaded', function () {
	var accumulatedPointsDiv = document.getElementById('accumulatedPoints');

    document.getElementById('settings').addEventListener('click', open_settings);

    chrome.storage.sync.get({
        showAccumulatedPoints: false,
		accumulatedPoints: 0
    }, function (items) {
        var showAccumulatedPoints = items.showAccumulatedPoints;
		var accumulatedPoints = items.accumulatedPoints;
        if (showAccumulatedPoints) {
			if (accumulatedPoints > 99999) {
				if (accumulatedPoints > 999999) {
					accumulatedPoints = (accumulatedPoints / 1000000).toFixed(2);
					accumulatedPoints += 'M';
				}
				else {
					accumulatedPoints = (accumulatedPoints / 1000).toFixed(2);
					accumulatedPoints += 'K';
				}
			}
			accumulatedPointsDiv.textContent = accumulatedPoints;
		}
		else {
			accumulatedPointsDiv.textContent = '';
		}
    });
});
