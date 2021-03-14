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
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action:"toggleEditMode"}, function(response){
			
		});
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
		   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action:"reverseWeeks"}, function(response){
			
		});
	});
	 });
  });