const COLOR_KEY = 'hmex_bgcolor';
const LANGUAGE_KEY = 'hmex_lang';

function resetCourses(cb) {
    chrome.storage.sync.get(null, function(items) {
        let allKeys = Object.keys(items);
        let remove = allKeys.filter(k => k.startsWith("closed_"));
        console.log(remove);
        chrome.storage.sync.remove(remove, function() {
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
	chrome.storage.sync.get([COLOR_KEY], function(result) {
        cb && cb(result[COLOR_KEY]);
    });
}
function getLanguage(cb) {
	chrome.storage.sync.get([LANGUAGE_KEY], function(result) {
        cb && cb(result[LANGUAGE_KEY]);
    });
}
function setLanguage(lang, cb) {
	chrome.storage.sync.set({[LANGUAGE_KEY]: lang}, function() {
        cb && cb(lang);
    });
}

const LANGUAGES = ["en", "he"];
function changeUILanguage(lang) {
	if (!LANGUAGES.includes(lang)) {
		return;
	}
	for (let lang of LANGUAGES) {
		document.querySelectorAll("." + lang).forEach((el) => {el.classList.add("lang-hide");});
	}
	document.querySelectorAll("." + lang).forEach((el) => {el.classList.remove("lang-hide")});
}


window.addEventListener('load', (e) => {
	getLanguage((lang) => {
		if (lang) {
		changeUILanguage(lang);
		}
	});
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
	document.getElementById("toHebrew").addEventListener('click', function() {
		setLanguage("he", (lang) => changeUILanguage(lang));
    });
	document.getElementById("toEnglish").addEventListener('click', function() {
        setLanguage("en", (lang) => changeUILanguage(lang));
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