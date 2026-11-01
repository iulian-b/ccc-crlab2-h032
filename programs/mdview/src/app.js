window.defaultMessageBoxTitle = "MDView";

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

// markdown-it's defaults keep this safe for any file: HTML in the text is shown as text,
// and links to javascript: and the like are left out.
var markdown = markdownit({ linkify: true });

function update_title() {
	document.title = (file_name || default_file_name_for_title) + " - MDView";

	if (frameElement && frameElement.$window) {
		frameElement.$window.title(document.title);
	}
}

function show_markdown(text) {
	var $document = document.getElementById("document");
	$document.innerHTML = markdown.render(text);

	// Relative links and pictures point next to the file, and links open in a new tab rather than in this window
	var folder = file_path.replace(/[^/]*$/, "");
	var folder_url = new URL(web_server_root_for_browserfs + folder.slice(1).split("/").map(encodeURIComponent).join("/"), location.href);
	for (var img of $document.querySelectorAll("img[src]")) {
		img.src = new URL(img.getAttribute("src"), folder_url);
	}
	for (var link of $document.querySelectorAll("a[href]")) {
		if (link.getAttribute("href").startsWith("#")) {
			continue;
		}
		link.href = new URL(link.getAttribute("href"), folder_url);
		link.target = "_blank";
		link.rel = "noopener noreferrer";
	}
}

update_title();

if (file_path) {
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.readFile(file_path, "utf8", function (error, content) {
			if (error) {
				showMessageBox({ iconID: "error", message: "Cannot open " + file_path + ": " + error.message });
				return;
			}
			show_markdown(content);
		});
	});
}
