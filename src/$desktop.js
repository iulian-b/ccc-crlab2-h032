if (localStorage.getItem("POST") === "0") {
	location.replace("$POST.html");
}

var $desktop = $(".desktop");
$desktop.css("touch-action", "none"); // TODO: should this be in FolderView, or is it to prevent scrolling the page or what?
var interacted = false;

// Folder view
var folder_view = new FolderView(desktop_folder_path, {
	asDesktop: true,
	openFileOrFolder: (path) => { // Note: may not be defined yet, so wrapping with a function.
		systemExecuteFile(path);
	},
});
$(folder_view.element).appendTo($desktop);

// Wallpaper
function setDesktopWallpaper(file, repeat, saveToLocalStorage) {
	const blob_url = URL.createObjectURL(file);
	$desktop.css({
		backgroundImage: `url(${blob_url})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		// backgroundSize: "auto",
		backgroundSize: "contain",
	});
	if (saveToLocalStorage) {
		var fr = new FileReader();
		window.fr = fr;
		fr.onload = () => {
			localStorage.setItem("wallpaper-data-url", fr.result);
			localStorage.setItem("wallpaper-repeat", repeat);
		};
		fr.onerror = () => {
			console.error("Error reading file (for setting wallpaper)", file);
		};
		fr.readAsDataURL(file);
	}
}
try {
	var wallpaper_data_url = localStorage.getItem("wallpaper-data-url");
	var wallpaper_repeat = localStorage.getItem("wallpaper-repeat");
	var theme_file_content = localStorage.getItem("desktop-theme");
	if (wallpaper_data_url) {
		fetch(wallpaper_data_url).then(r => r.blob()).then(file => {
			setDesktopWallpaper(file, wallpaper_repeat, false);
		});
	}
	if (theme_file_content) {
		loadThemeFromText(theme_file_content);
	}
} catch (error) {
	console.error(error);
}

// Prevent drag and drop from redirecting the page (the browser default behavior for files)
// TODO: only prevent if there are actually files; there's nothing that uses text inputs atm that's not in an iframe, so it doesn't matter YET (afaik)
// $G.on("dragover", function(e){
// 	e.preventDefault();
// });
// $G.on("drop", function(e){
// 	e.preventDefault();
// });

// Theme
function loadThemeFile(file) {
	var reader = new FileReader();
	reader.onload = () => {
		loadThemeFromText(reader.result);
	};
	reader.readAsText(file);
}
function applyTheme(cssProperties, documentElement = document.documentElement) {
	applyCSSProperties(cssProperties, { element: documentElement, recurseIntoIframes: true });
}
function loadThemeFromText(fileText) {
	var cssProperties = parseThemeFileString(fileText);
	applyTheme(cssProperties);
	window.themeCSSProperties = cssProperties;
}

// Events
$("html").on("dragover", function (event) {
	event.preventDefault();
	event.stopPropagation();
});
$("html").on("dragleave", function (event) {
	event.preventDefault();
	event.stopPropagation();
});
$("html").on("drop", function (event) {
	event.preventDefault();
	event.stopPropagation();
	var files = [...event.originalEvent.dataTransfer.files];
	for (var file of files) {
		if (file.name.match(/\.theme(pack)?$/i)) {
			loadThemeFile(file);
		}
	}
});

// Listeners
window.addEventListener('DOMContentLoaded', function() {
	if (localStorage.getItem("boot") === "true") {
		PDFViewer("/My Documents/CV (EN).pdf");
		// localStorage.setItem("init", "true");
	}
	if (localStorage.getItem("POST")) {
		document.getElementById("preloader").style.display = "none";
	}
});

// Run Handler
window.addEventListener("storage", () => {
	if (localStorage.getItem("run") != null) {
		var target = localStorage.getItem("run");

		// EXE
		if (target.includes(".exe")) {
			switch(target) {
				case "calc.exe": { Calculator(); break; }
				case "cmd.exe": { CommandPrompt(); break;}
				case "explorer.exe": { Explorer(); break; }
				case "solitaire.exe": { Solitaire(); break; }
				case "paint.exe": { Paint(); break; }
				case "notepad.exe": { Notepad(); break; }
				case "WINMINE.exe": { Minesweeper(); break; }
				case "pdfviewer.exe": { break; }
				case "picview.exe": { break; }
				case "pinball.exe": { Pinball(); break;}
				case "recorder.exe": { Recorder(); break; }
				case "winamp.exe": { openWinamp(); break; }
				case "wolf3d.exe": { Wolf3d(); break; }
				case "tombraider.exe": { TombRaider(); break; }
				case "quake3.exe": { Quake3(); break; }
				case "diablo.exe": { Diablo(); break; }
				case "minecraft.exe": { Minecraft(); break; }
				case "skifree.exe": { SkiFree(); break; }
				case "digitalis.exe": { audioPanic(); timeToPanic(); break; }
			}
		} else if (target !== "" ) Explorer(target);
		localStorage.removeItem("run");
	}
});

// Despite overflow:hidden on html and body,
// focusing elements that are partially offscreen can still scroll the page.
// For example, with opening Paint and moving it partially offscreen and opening Image > Attributes,
// the default focused button can scroll the entire desktop.
// We need to prevent (reset) scroll, and also avoid scrollIntoView().
$(window).on("scroll focusin", () => {
	window.scrollTo(0, 0);
});




