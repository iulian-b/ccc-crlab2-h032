var $desktop = $(".desktop");
$desktop.css("touch-action", "none"); // TODO: should this be in FolderView, or is it to prevent scrolling the page or what?
const loopAudio = new Audio('../audio/LOOP.wav');
const bootAudio = new Audio('../audio/BOOT.wav');
loopAudio.volume = 0.2;
bootAudio.volume = 0.2;
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

// Decided for it lo load everytime
// function open_CV() {
// 	if (localStorage.getItem("boot") === true) return;
// 	if (localStorage.getItem("boot") === null) {
// 		localStorage.setItem("boot", true);
// 		console.log("[USR] ibocse@crlab2-h032: Opened CV (pls hire me)");
// 		systemExecuteFile("/My Documents/CV (EN).pdf");
// 	} 
// 	return;
// }

// Listeners
window.addEventListener('DOMContentLoaded', function() {
	if (localStorage.getItem("boot") == "true") {
		systemExecuteFile("/My Documents/CV (EN).pdf");
	}
});

// Audio
// Audio can only play after the user has interacted with the page.
// Autoplay is deprecated, so this momentarily works despite it being a hackjob.
document.getElementById('desktop').addEventListener('click', () => {
	if (!interacted) {
		interacted = true;

		// Play the boot audio first
		bootAudio.play();
		// When the boot audio finishes, play the loop audio
		bootAudio.addEventListener("ended", function() {
			loopAudio.play();
		});

		// When the loop audio finishes, loop the file itself (hence then name)
		loopAudio.addEventListener("ended", function() {
			loopAudio.play();
		});
	} 
});

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
				case "winamp.exe": { winamp(); break; }
			}
		} else if (target != "" ) Explorer(target);
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




  