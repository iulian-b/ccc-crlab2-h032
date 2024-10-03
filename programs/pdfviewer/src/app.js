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

function load_pdf() {
	frameElement.parentElement.parentElement.style.top='2%';
	frameElement.parentElement.parentElement.style.left='60%';
	var newPdf = '<embed src="../../' + file_path + '", scrollbar=0, frameborder=0, width="100%" height="1000px" />';
	var parent = document.getElementById("document");
	parent.insertAdjacentHTML('afterbegin', newPdf); 
}

function update_title() {
	document.title = (file_name || default_file_name_for_title) + " - PDF Viewer";
	
	if (frameElement && frameElement.$window) 
		frameElement.$window.title(document.title);
}

update_title();
load_pdf();