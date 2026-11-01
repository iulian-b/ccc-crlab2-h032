window.defaultMessageBoxTitle = "PDF Viewer";

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
var file_path = query.path;
var file_name = file_path && file_name_from_path(file_path);
var default_file_name_for_title = "Untitled";

// (the window is sized and placed by PDFViewer() on the desktop)
function load_pdf() {
	if (!file_path) {
		return;
	}
	file_path_to_viewable_url(file_path, ["pdf"], function (error, url) {
		if (error) {
			showMessageBox({ iconID: "error", message: "Cannot open " + file_path + ": " + error.message + "." });
			return;
		}
		var pdf = document.createElement("embed");
		pdf.type = "application/pdf";
		pdf.src = url;
		document.getElementById("document").prepend(pdf);
	});
}

function update_title() {
	document.title = (file_name || default_file_name_for_title) + " - PDF Viewer";

	if (frameElement && frameElement.$window)
		frameElement.$window.title(document.title);
}

update_title();
load_pdf();
