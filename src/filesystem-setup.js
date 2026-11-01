
var __fs_initialized;
var __fs_errored;
var __fs_waiting_callbacks = [];

const desktop_folder_path = "/Desktop/";

// For Wayback Machine, match URLs like https://web.archive.org/web/20191213113214/https://98.js.org/
// (also match URLs like https://98.js.org/ because why not)
const web_server_root_for_browserfs =
	location.href.match(/98.js.org/) ?
		location.href.match(/.*98.js.org/)[0] + "/" :
		"/";

BrowserFS.configure({
	fs: "OverlayFS",
	options: {
		writable: {
			fs: "IndexedDB",
			options: {
				storeName: "C:"
			}
		},
		readable: {
			fs: "XmlHttpRequest",
			options: {
				index: web_server_root_for_browserfs + "filesystem-index.json",
				baseUrl: web_server_root_for_browserfs
			}
		}
	}
	// TODO: mount the repo contents at something like C:\98\
	// but other OS stuff from a subfolder of the repo as root (C? HD? hard-drive? disk? OS?)
	// the desktop at something like.. well I guess C:\98\desktop
	// and I could have the default desktop setup in source control there
}, function (error) {
	if (error) {
		__fs_errored = true;
		if (__fs_waiting_callbacks.length) {
			// TODO: DRY (can probably simplify this logic significantly)
			alert("The filesystem is not available. It failed to initialize.");
		}
		__fs_waiting_callbacks = [];
		// TODO: message box; offer to reset the filesystem
		throw error;
	}
	__fs_initialized = true;
	for (var i = 0; i < __fs_waiting_callbacks.length; i++) {
		__fs_waiting_callbacks[i]();
	}
	__fs_waiting_callbacks = [];
});

// Starting the filesystem usually takes well under a second, but it downloads filesystem-index.json,
// so a slow connection or a busy device can make it take longer. What's asked of it in the meantime
// still happens once it's ready; this only says something if it seems stuck.
setTimeout(function () {
	if (!__fs_initialized && !__fs_errored && __fs_waiting_callbacks.length) {
		alert("The filesystem is taking a long time to start.");
	}
}, 30000);

function withFilesystem(callback) {
	if (__fs_initialized) {
		callback();
	} else if (__fs_errored) {
		alert("The filesystem is not available. It failed to initialize.");
	} else {
		__fs_waiting_callbacks.push(callback);
	}
}
// TODO: never use alert(); use thematic, non-blocking dialog windows, preferably with warning and error icons
// I have a show_error_message in jspaint, but with no warning or error icons - as of writing; see https://github.com/1j01/jspaint/issues/84

function file_name_from_path(file_path) {
	return file_path.split("\\").pop().split("/").pop();
}

function file_extension_from_path(file_path) {
	return (file_path.match(/\.(\w+)$/) || [, ""])[1];
}

// Turns a virtual filesystem path (e.g. from a ?path= query parameter) into a URL on this server.
// Returns null for anything that isn't a plain absolute path with one of the allowed extensions,
// so the result can't point at another origin or smuggle in a query string.
function file_path_to_url(file_path, allowed_extensions) {
	if (typeof file_path !== "string" || !file_path.startsWith("/") || file_path.startsWith("//")) {
		return null;
	}
	if (!allowed_extensions.includes(file_extension_from_path(file_path).toLowerCase())) {
		return null;
	}
	return web_server_root_for_browserfs + file_path.slice(1).split("/").map(encodeURIComponent).join("/");
}

var mime_types_by_extension = {
	bmp: "image/bmp",
	gif: "image/gif",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	pdf: "application/pdf",
	png: "image/png",
	webp: "image/webp",
};

// Like file_path_to_url, but for files that may only exist in this browser (dropped onto the desktop, saved from Paint, ...).
// Files the site serves keep their URL (so a downloaded PDF keeps its name); the rest are read into a blob: URL.
// Calls back with (error, url).
function file_path_to_viewable_url(file_path, allowed_extensions, callback) {
	var url = file_path_to_url(file_path, allowed_extensions);
	if (!url) {
		return callback(new Error("not a supported file path"));
	}
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.exists(file_path, function (exists) {
			if (!exists) {
				return callback(new Error("file not found"));
			}
			var browser_storage = fs.getRootFS().getOverlayedFileSystems().writable;
			browser_storage.exists(file_path, function (in_browser_storage) {
				if (!in_browser_storage) {
					return callback(null, url);
				}
				fs.readFile(file_path, function (error, buffer) {
					if (error) {
						return callback(error);
					}
					var type = mime_types_by_extension[file_extension_from_path(file_path).toLowerCase()];
					callback(null, URL.createObjectURL(new Blob([new Uint8Array(buffer)], { type: type })));
				});
			});
		});
	});
}
