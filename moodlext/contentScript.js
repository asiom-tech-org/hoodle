function setClose(course, cb) {
	let key = 'closed_' + course;
	console.log(key);
	chrome.storage.local.set({[key]: true}, function() {
	  cb && cb(course);
	});
}

function getClosed(course, cb) {
	let key = 'closed_' + course;

	chrome.storage.local.get([key], function(result) {
	  cb && cb(result[key]);
	});
}
function hideCourse(el) {
	el.style.display = 'none';
}
function getCourseId(el) {
	return el.getElementsByTagName("p")[0].getAttribute("data-node-key");
}

const EDITMODE_CLASS = "hmex-editmode";
const REVERSEWEEKS_CLASS = "hmex-reverse";
window.addEventListener('load', (event) => {
	
	chrome.runtime.onMessage.addListener(msgObj => {
		if (msgObj.action == "toggleEditMode") {
			document.body.classList.toggle(EDITMODE_CLASS);
		}
		if (msgObj.action == "reverseWeeks") {
			document.body.classList.toggle(REVERSEWEEKS_CLASS);
		}
	});
	
	
  let courseButtons = document.querySelectorAll("li.type_course");
  courseButtons.forEach((v) => {
	  let t = document.createElement("div");
	  let xButton = document.createElement("button");
	  let cid = getCourseId(v);
	  getClosed(cid, (k) => {
		  if (k) {
			  hideCourse(v);
		  }
	  })
	  v.prepend(t);
	  t.classList.add("hmex-edit");
	  t.setAttribute('style', 'position: absolute;right: 5px;');
	  xButton.innerHTML = 'X';
	  xButton.setAttribute('style', "background-color: #ff7171;border: 0px;font-size: 10px;");
	  t.appendChild(xButton);
	  xButton.onclick = (event) => {
		 setClose(cid, () => {hideCourse(v)});
	  };
  });
});