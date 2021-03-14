function setClose(course, cb) {
    let key = 'closed_' + course;
    chrome.storage.sync.set({
        [key]: true
    }, function() {
        cb && cb(course);
    });
}
function removeClose(course, cb) {
    let key = 'closed_' + course;
    chrome.storage.sync.remove([key], function() {
        cb && cb(course);
    });
}

function getClosed(course, cb) {
    let key = 'closed_' + course;

    chrome.storage.sync.get([key], function(result) {
        cb && cb(result[key]);
    });
}
const COLOR_KEY = 'hmex_bgcolor';
function setColor(color, cb) {
	chrome.storage.sync.set({
        [COLOR_KEY]: color,
    }, function() {
        cb && cb(course);
    });
}
function getColor(cb) {
	chrome.storage.sync.get([COLOR_KEY], function(result) {
        cb && cb(result[COLOR_KEY]);
    });
}
function resetColor(cb) {
	chrome.storage.sync.remove([COLOR_KEY], function(result) {
        cb && cb();
    });
}
function hideCourse(el) {
    el.classList.add("hmex-hidden");
}
function unhideCourse(el) {
    el.classList.remove("hmex-hidden");
}

function getCourseId(el) {
    return el.getElementsByTagName("p")[0].getAttribute("data-node-key");
}

const EDITMODE_CLASS = "hmex-editmode";
const REVERSEWEEKS_CLASS = "hmex-reverse";

let CSS_COLOR_TEMPLATE = `
#page-header div.d-flex:nth-of-type(1){
    background: {{1}} !important;
}

#frame-column, .login_div3{
    background: {{2}} !important;
}

.block, .card-body.p-3, .card-title.d-inline{
    background-color: {{2}} !important;
}

.login_div3{
    border-color: {{3}} !important;
}
`;

function createColorCss(c1, c2, c3) {
	let t = CSS_COLOR_TEMPLATE;
	t = t.replace(/\{\{1\}\}/g, c1);
	t = t.replace(/\{\{2\}\}/g, c2);
	t = t.replace(/\{\{3\}\}/g, c3);
	return t;
}


document.addEventListener('DOMContentLoaded', (event) => {
	var newColorStyle = document.createElement('style');
	document.body.appendChild(newColorStyle);
	getColor(function(c) {
		if (c) {
			newColorStyle.innerHTML = '';
			newColorStyle.appendChild(document.createTextNode(createColorCss(c, c, c)));
		}
	});

    chrome.runtime.onMessage.addListener(msgObj => {
        if (msgObj.action == "toggleEditMode") {
            document.body.classList.toggle(EDITMODE_CLASS);
        }
        if (msgObj.action == "reverseWeeks") {
            document.body.classList.toggle(REVERSEWEEKS_CLASS);
        }
		if (msgObj.action == "changeColor") {
			let color = msgObj.data;
			newColorStyle.innerHTML = '';
			newColorStyle.appendChild(document.createTextNode(createColorCss(color, color, color)));
			setColor(color);
		}
		if (msgObj.action == "resetColor") {
			newColorStyle.innerHTML = '';
			resetColor();
		}
    });


    let courseButtons = document.querySelectorAll("li.type_course");
    courseButtons.forEach((v) => {
        let t = document.createElement("div");
        let cid = getCourseId(v);
        getClosed(cid, (k) => {
            if (k) {
                hideCourse(v);
            }
        })
        v.prepend(t);
        t.classList.add("hmex-edit");
		
		let xButton = document.createElement("button");
		xButton.classList.add("hmex-x");
        xButton.innerHTML = 'X';
        t.appendChild(xButton);
		
		let vButton = document.createElement("button");
		vButton.classList.add("hmex-v");
        vButton.innerHTML = 'V';
        t.appendChild(vButton);
		
        xButton.onclick = (event) => {
            setClose(cid, () => {
                hideCourse(v)
            });
        };
		vButton.onclick = (event) => {
            removeClose(cid, () => {
                unhideCourse(v)
            });
        };
    });
});