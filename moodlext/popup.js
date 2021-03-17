const DISABLED_KEY = 'hoodle_disable';
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

function getDisabled(cb) {
	chrome.storage.sync.get([DISABLED_KEY], function(result) {
        cb && cb(result[DISABLED_KEY]);
    });
}
function setDisabled(is_disabled, cb) {
	chrome.storage.sync.set({[DISABLED_KEY]: is_disabled}, function(result) {
        cb && cb(is_disabled);
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
function changeUIDisabled(is_disabled) {
	if (is_disabled) {
		document.body.classList.remove("hoodle-enabled");
		document.body.classList.add("hoodle-disabled");
	} else {
		document.body.classList.add("hoodle-enabled");
		document.body.classList.remove("hoodle-disabled");
	}
}
function updateUIDisabled() {
	getDisabled((is_disabled) => {
		if (is_disabled === undefined || is_disabled === false) {
			changeUIDisabled(false);
		} else {
			changeUIDisabled(true);
		}
	});
}

function showMessage(message) {
	let el = document.createElement("div");
	el.classList.add("message");
	el.innerHTML = message;
	document.body.appendChild(el);
	setTimeout(()=>{
		el.classList.add("message-open");
	}, 50);
	setTimeout(()=>{
		el.classList.remove("message-open");
	}, 4000);
}

function showRefreshPagePrompt() {
	showMessage(`
<span class="en lang-hide">Refresh the page to apply changes</span>
<span class="he">רעננו את הדף כדי לצפות בשינויים</span>
	`);
}

window.addEventListener('load', (e) => {
	updateUIDisabled();
	
	getLanguage((lang) => {
		if (lang) {
		changeUILanguage(lang);
		}
	});
	
	document.getElementById("disableExtension").addEventListener('click', function() {
        setDisabled(true, ()=>{updateUIDisabled()});
		showRefreshPagePrompt();
    });
	document.getElementById("enableExtension").addEventListener('click', function() {
        setDisabled(false, ()=>{updateUIDisabled()});
		showRefreshPagePrompt();
    });
	
    document.getElementById("resetCourses").addEventListener('click', function() {
        resetCourses();
		showRefreshPagePrompt();
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