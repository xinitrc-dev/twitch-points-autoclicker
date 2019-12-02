var updates = {
    '1.5': [
        '02 Dec 2019',
        'Code optimization.',
		'Buxfix: mysterious red chests are now being clicked!',
        'Updated bonus points button detection (in case of future updates).',
		'Added Popup page to the extension.',
		'Added Settings page to the extension.',
		'Added option to track points gained through extension.',
		'Added option to hide bonus chests.',
		'Added notifications for updates (can toggle off in settings page).',
		'2 new permissions: <a href=https://xinitrc.ca/autoclicker-permissions/#storage>Storage</a> and <a href=https://xinitrc.ca/autoclicker-permissions/#displayNotifications>Display Notifications</a>.'
    ],
    '1.4': [
		'26 Oct 2019',
        'No user-facing changes.',
        'Optimized and commented the code.',
        'Extension uploaded publically to <a href=https://github.com/xinitrc-dev/twitch-points-autoclicker>GitHub!</a>'
    ],
    '1.3': [
        '24 Oct 2019',
        'Added precheck when the extension is launched/installed <br>to see if a twitch page is already opened.',
		'1 new permission: <a href=https://xinitrc.ca/autoclicker-permissions/#browsingHistory>Read your browsing history</a>'
    ]
};

var data = '';

for (version in updates) {
    data += '<h1>' + version + '</h1>' +
			'<p id="date">' + updates[version][0] + '</p>' +
            '<ul class="vdesc">';
    for (i = 1, len = updates[version].length; i < len; i++) {
        data += '<li>' + updates[version][i] + '</li>';
    }
    data += '</ul><br>';
}

var filler = document.getElementById('filler');
filler.innerHTML = data;

