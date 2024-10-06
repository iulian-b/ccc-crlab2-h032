let currentZoom = 1;
let minZoom = 1;
let maxZoom = 3;
let stepSize = 0.1;
let container = document.getElementById("app");

function zoomImage(direction)
{
    let newZoom = currentZoom + direction * stepSize;

    // Limit the zoom level to the minimum and maximum
    // values
    if (newZoom < minZoom || newZoom > maxZoom) {
        return;
    }

    currentZoom = newZoom;

    // Update the CSS transform of the image to scale it
    let image
        = document.getElementById("pic");
    image.style.transform = "scale(" + currentZoom + ")";
}

container.addEventListener("wheel", function(event) {
    // Zoom in or out based on the scroll direction
    let direction = event.deltaY > 0 ? -1 : 1;
    zoomImage(direction);
});



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

function load_pic() {
	// var newPic = '<img src="' + file_path + '" id="pic", style="position: relative; left: 45%; top: 45%"/>';
	var newPic = '<img src="' + file_path + '" id="pic", style="display: block; margin: 0 auto; height: 100%"/>';

	document.getElementById("app").insertAdjacentHTML('afterbegin', newPic); 
}

function update_title() {
	document.title = (file_name || default_file_name_for_title) + " - PDF Viewer";
	
	if (frameElement && frameElement.$window) 
		frameElement.$window.title(document.title);
}

update_title();
load_pic();