window.defaultMessageBoxTitle = "Run";

let container = document.getElementById("app");
const panicAudio = new Audio('../../../audio/PANIC.wav');

$("body").on("mousedown selectstart contextmenu", function (e) {
	if (
		e.target instanceof HTMLSelectElement ||
		e.target instanceof HTMLTextAreaElement ||
		(e.target instanceof HTMLLabelElement && e.type !== "contextmenu") ||
		(e.target instanceof HTMLInputElement && e.target.type !== "color")
	) {
		return;
	}
	e.preventDefault();
});

function cancel() {
	window.close();
}
document.getElementById("cancel-button").addEventListener("click", cancel);

function parse_query_string(queryString) {
	var query = {};
	var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
	}
	return query;
}

var query = parse_query_string(location.search);
if (query.path) {
	var file_path = query.path;
	var file_name = file_name_from_path(file_path);
} else if (location.search.length > 1) {
	var local_storage_document_id = location.search.replace("?", "");
	var file_name = location.search.replace("?", "");
}
var default_file_name_for_title = "Untitled";

function position() {
	frameElement.parentElement.parentElement.style.top='unset';
	frameElement.parentElement.parentElement.style.bottom='4%';
	frameElement.parentElement.parentElement.style.left='220px';
	return;
}
position();

function update_title() {
	document.title = "Run";
	
	if (frameElement && frameElement.$window) 
		frameElement.$window.title(document.title);
}
update_title();


document.getElementById("runform").addEventListener("submit", function(event){
	event.preventDefault();
	var target = document.getElementById("target").value;
	if (target == "digitalis.exe") panicAudio.play();
	// The desktop that opened this dialog (when opened on its own, parent is this window and there's nothing to run)
	parent.runCommand?.(target);

	window.close();
  });