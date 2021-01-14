function open_settings() {
    chrome.tabs.create({url: chrome.extension.getURL('options.html')});
}

document.addEventListener('DOMContentLoaded', function () {
	var accumulatedPointsDiv = document.getElementById('accumulatedPoints');

    document.getElementById('settings').addEventListener('click', open_settings);

    chrome.storage.sync.get({
        showAccumulatedPoints: false,
		clickedBonusPoints: 0
    }, function (items) {
        var showAccumulatedPoints = items.showAccumulatedPoints;
		var clickedBonusPoints = items.clickedBonusPoints;
        if (showAccumulatedPoints) {
			if (clickedBonusPoints > 99999) {
				if (clickedBonusPoints > 999999) {
					clickedBonusPoints = (clickedBonusPoints / 1000000).toFixed(2);
					clickedBonusPoints += 'M';
				}
				else {
					clickedBonusPoints = (clickedBonusPoints / 1000).toFixed(2);
					clickedBonusPoints += 'K';
				}
			}
			accumulatedPointsDiv.textContent = 'Collected ' + clickedBonusPoints.toString() + ' times!';
		}
		else {
			accumulatedPointsDiv.textContent = '';
		}
    });
});
