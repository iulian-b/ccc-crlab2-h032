var $desktop = $(".desktop");
$desktop.css("touch-action", "none"); // TODO: should this be in FolderView, or is it to prevent scrolling the page or what?
const loopAudio = new Audio('../audio/LOOP.wav');
const bootAudio = new Audio('../audio/BOOT.wav');
const panicAudio = new Audio('../audio/PANIC.wav');
loopAudio.volume = 0.2;
bootAudio.volume = 0.2;
panicAudio.volume = 1.0;
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

function timeToPanic() {
	// Play audio
	bootAudio.pause();
	loopAudio.pause();
	panicAudio.play();

	const kernelText = `<p id="kpanic" class="crt" style="color: whitesmoke; font-family: IBM3x;">
		[	1.089542] Kernel panic - not syncing: VFS: Unable to mount package digitalis on unkown-block(0,0)<br>
		[	1.090150] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 3.10.8-327.el7x86_64 #<br>
		[	1.091479] Hardware name: (USERAGENT)<br>
		[	1.092354] ffffffff8184e928 000000001e6559f5 ffff880139387d60 ffffffff816351f1<br>
		[	1.092846] ffff880139387de0 ffffffff8162ea6c ffffffff00000010 ffff880139387df0<br>
		[	1.099352] ffff880139387d90 000000001e6559f5 000000001e6559f5 ffff880139387e00<br>
		[	1.101371] Call Trace:<br>
		[	1.102354]  [<ffff69756c69616e>] digitalis+0xff/0xff<br>
		[	1.102483]  [<ffffffff81638c78>] run+0x3a/0x6c<br>
		[	1.103047]  [<ffffffff81638c78>] desktop+0x24/0x1f<br>
		[	1.103705]  [<ffffffff816351f1>] dump_stack+0x19/0x1b<br>
		[	1.104687]  [<ffffffff8162ea6c>] panic+0xd8/0x1e7<br>
		[	1.104952]  [<ffffffff81a8d5fa>] mount_block_root+0x2a1/0x2b0<br>
		[	1.105784]  [<ffffffff81a8d65c>] mount_root+0x53/0x56<br>
		[	1.106415]  [<ffffffff81a8d79b>] prepare_namespace+0x13c/0x174<br>
		[	1.106941]  [<ffffffff81a8d268>] kerne;_init_freeable+0x1f0/0x217<br>
		[	1.107124]  [<ffffffff81a8c9db>] ? initcall_blacklist+0xb0/0xb0<br>
		[	1.107715]  [<ffffffff81624e10>] ? rest_init+0x80/0x80<br>
		[	1.107856]  [<ffffffff81624e1e>] kernel_init+0xe/0xf0<br>
		[	1.107911]  [<ffffffff81645858>] ret_from_fork+0x58/0x90<br>
		[	1.108146]  [<ffffffff81624e10>] ? rest_init+0x80/0x80<br>
		</p>`;

	$desktop.css({backgroundImage: `url("../images/glitch.jpg")`});
	sleep(1000).then(() => { 
		document.documentElement.innerHTML = '<body style="background-color:black;" class="unselectable"></body>'; 
		document.body.insertAdjacentHTML('beforeend',`<link href="src/boot.css" rel="stylesheet" type="text/css">`);
		document.body.insertAdjacentHTML('beforeend',`<link href="src/crt.css" rel="stylesheet" type="text/css">`);
		document.body.insertAdjacentHTML('beforeend',kernelText);
    });
}

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
				case "winamp.exe": { winamp(); break; }
				case "digitalis.exe": { timeToPanic(); break; }
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




  