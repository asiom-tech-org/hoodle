const COLOR_KEY = 'hmex_bgcolor';

function resetCourses(cb) {
    chrome.storage.local.get(null, function(items) {
        let allKeys = Object.keys(items);
        let remove = allKeys.filter(k => k.startsWith("closed_"));
        console.log(remove);
        chrome.storage.local.remove(remove, function() {
            cb && cb();
        });
    });
}

function toggleEditMode() {
    sendAction("toggleEditMode");
}

function sendAction(action, data, cb) {
	if (!data) {
		data = {};
	}
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: action, data: data
        }, function(response) {
            cb && cb(response);
        });
    });
}

function getColor(cb) {
	chrome.storage.local.get([COLOR_KEY], function(result) {
		console.log(result);
        cb && cb(result[COLOR_KEY]);
    });
}

window.addEventListener('load', (e) => {
    console.log("loaded");
    document.getElementById("resetCourses").addEventListener('click', function() {
        resetCourses();
    });
    document.getElementById("toggleEditMode").addEventListener('click', function() {
        toggleEditMode();
    });
    document.getElementById("reverseWeeks").addEventListener('click', function() {
        sendAction("reverseWeeks");
    });
	document.getElementById("resetColor").addEventListener('click', function() {
        sendAction("resetColor");
    });
	
	getColor(function(c) {
		let parent = document.querySelector('#changeColor');
		let options = {parent: parent, popup: 'bottom', alpha: false};
		if (c) {
			options.color = c;
		}
		let picker = new Picker(options);

		// You can do what you want with the chosen color using two callbacks: onChange and onDone.
		picker.onChange = function(color) {
			sendAction("changeColor", color.rgbaString);
		};
	});
});