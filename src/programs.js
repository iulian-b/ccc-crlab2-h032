window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

function show_help(options) {
	const $help_window = $Window({
		title: options.title || "Help Topics",
		icons: iconsAtTwoSizes("chm"),
		resizable: true,
	})
	$help_window.addClass("help-window");

	let ignore_one_load = true;
	let back_length = 0;
	let forward_length = 0;

	const $main = $(E("div")).addClass("main");
	const $toolbar = $(E("div")).addClass("toolbar");
	const add_toolbar_button = (name, sprite_n, action_fn, enabled_fn) => {
		const $button = $("<button class='lightweight'>")
			.append($("<span>").text(name))
			.appendTo($toolbar)
			.on("click", () => {
				action_fn();
			});
		$("<div class='icon'/>")
			.appendTo($button)
			.css({
				backgroundPosition: `${-sprite_n * 55}px 0px`,
			});
		const update_enabled = () => {
			$button[0].disabled = enabled_fn && !enabled_fn();
		};
		update_enabled();
		$help_window.on("click", "*", update_enabled);
		$help_window.on("update-buttons", update_enabled);
		return $button;
	};
	const measure_sidebar_width = () =>
		$contents.outerWidth() +
		parseFloat(getComputedStyle($contents[0]).getPropertyValue("margin-left")) +
		parseFloat(getComputedStyle($contents[0]).getPropertyValue("margin-right")) +
		$resizer.outerWidth();
	const $hide_button = add_toolbar_button("Hide", 0, () => {
		const toggling_width = measure_sidebar_width();
		$contents.hide();
		$resizer.hide();
		$hide_button.hide();
		$show_button.show();
		$help_window.width($help_window.width() - toggling_width);
		$help_window.css("left", $help_window.offset().left + toggling_width);
	});
	const $show_button = add_toolbar_button("Show", 5, () => {
		$contents.show();
		$resizer.show();
		$show_button.hide();
		$hide_button.show();
		const toggling_width = measure_sidebar_width();
		$help_window.width($help_window.width() + toggling_width);
		$help_window.css("left", $help_window.offset().left - toggling_width);
		// $help_window.applyBounds() would push the window to fit (before trimming it only if needed)
		// Trim the window to fit (especially for if maximized)
		if ($help_window.offset().left < 0) {
			$help_window.width($help_window.width() + $help_window.offset().left);
			$help_window.css("left", 0);
		}
	}).hide();
	add_toolbar_button("Back", 1, () => {
		$iframe[0].contentWindow.history.back();
		ignore_one_load = true;
		back_length -= 1;
		forward_length += 1;
	}, () => back_length > 0);
	add_toolbar_button("Forward", 2, () => {
		$iframe[0].contentWindow.history.forward();
		ignore_one_load = true;
		forward_length -= 1;
		back_length += 1;
	}, () => forward_length > 0);
	add_toolbar_button("Options", 3, () => { }, () => false); // TODO: access key &O
	add_toolbar_button("Web Help", 4, () => {
		iframe.src = "help/online_support.htm";
	});

	const $iframe = $("<iframe sandbox='allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-downloads'>")
		.attr({ src: "help/default.html" })
		.addClass("inset-deep");
	const iframe = $iframe[0];
	enhance_iframe(iframe);
	iframe.$window = $help_window; // for focus handling integration
	const $resizer = $(E("div")).addClass("resizer");
	const $contents = $(E("ul")).addClass("contents inset-deep");

	// TODO: fix race conditions
	$iframe.on("load", () => {
		if (!ignore_one_load) {
			back_length += 1;
			forward_length = 0;
		}
		iframe.contentWindow.location.href
		ignore_one_load = false;
		$help_window.triggerHandler("update-buttons");
	});

	$main.append($contents, $resizer, $iframe);
	$help_window.$content.append($toolbar, $main);

	$help_window.css({ width: 800, height: 600 });

	$iframe.attr({ name: "help-frame" });
	$iframe.css({
		backgroundColor: "white",
		border: "",
		margin: "1px",
	});
	$contents.css({
		margin: "1px",
	});
	$help_window.center();

	$main.css({
		position: "relative", // for resizer
	});

	const resizer_width = 4;
	$resizer.css({
		cursor: "ew-resize",
		width: resizer_width,
		boxSizing: "border-box",
		background: "var(--ButtonFace)",
		borderLeft: "1px solid var(--ButtonShadow)",
		boxShadow: "inset 1px 0 0 var(--ButtonHilight)",
		top: 0,
		bottom: 0,
		zIndex: 1,
	});
	$resizer.on("pointerdown", (e) => {
		let pointermove, pointerup;
		const getPos = (e) =>
			Math.min($help_window.width() - 100, Math.max(20,
				e.clientX - $help_window.$content.offset().left
			));
		$G.on("pointermove", pointermove = (e) => {
			$resizer.css({
				position: "absolute",
				left: getPos(e)
			});
			$contents.css({
				marginRight: resizer_width,
			});
		});
		$G.on("pointerup", pointerup = (e) => {
			$G.off("pointermove", pointermove);
			$G.off("pointerup", pointerup);
			$resizer.css({
				position: "",
				left: ""
			});
			$contents.css({
				flexBasis: getPos(e) - resizer_width,
				marginRight: "",
			});
		});
	});

	const parse_object_params = $object => {
		// parse an $(<object>) to a plain object of key value pairs
		const object = {};
		for (const param of $object.children("param").get()) {
			object[param.name] = param.value;
		}
		return object;
	};

	let $last_expanded;

	const make_$item = text => {
		const $item = $(E("div")).addClass("item").text(text);
		$item.on("mousedown", () => {
			$contents.find(".item").removeClass("selected");
			$item.addClass("selected");
		});
		$item.on("click", () => {
			const $li = $item.parent();
			if ($li.is(".folder")) {
				if ($last_expanded) {
					$last_expanded.not($li).removeClass("expanded");
				}
				$li.toggleClass("expanded");
				$last_expanded = $li;
			}
		});
		return $item;
	};

	const $default_item_li = $(E("li")).addClass("page");
	$default_item_li.append(make_$item("Welcome to Help").on("click", () => {
		$iframe.attr({ src: "help/default.html" });
	}));
	$contents.append($default_item_li);

	function renderItemFromContents(source_li, $folder_items_ul) {
		const object = parse_object_params($(source_li).children("object"));
		if ($(source_li).find("li").length > 0) {

			const $folder_li = $(E("li")).addClass("folder");
			$folder_li.append(make_$item(object.Name));
			$contents.append($folder_li);

			const $folder_items_ul = $(E("ul"));
			$folder_li.append($folder_items_ul);

			$(source_li).children("ul").children().get().forEach((li) => {
				renderItemFromContents(li, $folder_items_ul);
			});
		} else {
			const $item_li = $(E("li")).addClass("page");
			$item_li.append(make_$item(object.Name).on("click", () => {
				$iframe.attr({ src: `${options.root}/${object.Local}` });
			}));
			if ($folder_items_ul) {
				$folder_items_ul.append($item_li);
			} else {
				$contents.append($item_li);
			}
		}
	}

	$.get(options.contentsFile, hhc => {
		$($.parseHTML(hhc)).filter("ul").children().get().forEach((li) => {
			renderItemFromContents(li, null);
		});
	});

	// @TODO: keyboard accessability
	// $help_window.on("keydown", (e)=> {
	// 	switch(e.keyCode){
	// 		case 37:
	// 			show_error_message("MOVE IT");
	// 			break;
	// 	}
	// });
	var task = new Task($help_window);
	task.$help_window = $help_window;
	return task;
}

function Notepad(file_path) {
	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in make_iframe_window)
	var document_title = file_path ? file_name_from_path(file_path) : "Untitled";
	var win_title = document_title + " - Notepad";
	// TODO: focus existing window if file is currently open?

	var $win = make_iframe_window({
		src: "programs/notepad/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icons: iconsAtTwoSizes("notepad"),
		title: win_title,
		outerWidth: 480,
		outerHeight: 321,
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: notepad.exe(" + file_path + ")");
	return new Task($win);
}
Notepad.acceptsFilePaths = true;


function Markdown(file_path) {
	var document_title = file_path ? file_name_from_path(file_path) : "Untitled";
	var win_title = document_title + " - MDView";

	var $win = make_iframe_window({
		src: "programs/mdview/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icons: iconsAtTwoSizes("md"),
		title: win_title,
		outerWidth: 480,
		outerHeight: 321,
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: mdview.exe(" + file_path + ")");
	return new Task($win);
}
Markdown.acceptsFilePaths = true;

function openRunDialog() {
	var $win = make_iframe_window({
		src: "programs/run/index.html",
		// icons: iconsAtTwoSizes("run"),
		title: "Run",
		outerWidth: 360,
		outerHeight: 163,
		zIndex: 200,
		resizable: false,
	});
	console.log("[USR] ibocse@crlab2-h032: run.exe()");
	return new Task($win);
}
openRunDialog.acceptsFilePaths = true;

function Wolf3d() {
	let $win = make_iframe_window({
		src: "https://git.nihilogic.dk/wolf3d",
		icons: iconsAtTwoSizes("wolf-3d"),
		title: "Wolf 3D",
		outerWidth: 750,
		outerHeight: 500,
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: wolf3d.exe()");
	return new Task($win);
}
Wolf3d.acceptsFilePaths = false;

function Diablo() {
	let $win = make_iframe_window({
		src: "https://d07riv.github.io/diabloweb/",
		icons: iconsAtTwoSizes("diablo1"),
		title: "wolf3d",
		outerWidth: 1280,
		outerHeight: 720,
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: diablo.exe()");
	return new Task($win);
}
Diablo.acceptsFilePaths = false;

// FIX SIZE
function TombRaider() {
	let $win = make_iframe_window({
		src: "http://xproger.info/projects/OpenLara/",
		icons: iconsAtTwoSizes("tomb-raider"),
		title: "Tomb Raider",
		outerWidth: 865,
		outerHeight: 510,
		resizable: true
	});
	console.log("[USR] ibocse@crlab2-h032: tombraider.exe()");
	return new Task($win);
}
TombRaider.acceptsFilePaths = false;

function Quake3() {
	let $win = make_iframe_window({
		src: "http://www.quakejs.com/play?set%20fs_game%20baseq3&set%20g_gametype%200&set%20g_teamAutoJoin%201&map%20q3dm1&addbot%20grunt%204%20f&addbot%20major%204%20f&addbot%20sarge%204%20f&addbot%20grunt%204%20f&addbot%20major%204%20f",
		icons: iconsAtTwoSizes("quake3"),
		title: "Quake III",
		outerWidth: 1280,
		outerHeight: 720,
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: quake3.exe()");
	return new Task($win);
}
Quake3.acceptsFilePaths = false;

function Minecraft() {
	let $win = make_iframe_window({
		src: "https://eaglercraft.com/mc/1.8.8/",
		icons: iconsAtTwoSizes("minecraft"),
		title: "Minecraft",
		outerWidth: 1280,
		outerHeight: 720,
		resizable: true
	});
	console.log("[USR] ibocse@crlab2-h032: minecraft.exe()");
	return new Task($win);
}
Minecraft.acceptsFilePaths = false;

function SkiFree() {
	let $win = make_iframe_window({
		src: "https://basicallydan.github.io/skifree.js/",
		icons: iconsAtTwoSizes("skifree"),
		title: "SkiFree",
		outerWidth: 720,
		outerHeight: 576,
		resizable: true
	});
	console.log("[USR] ibocse@crlab2-h032: skifree.exe()");
	return new Task($win);
}
SkiFree.acceptsFilePaths = false;

function PDFViewer(file_path) {
	// There is no normal way to determine the height of a pdf that has yet to be loaded into the DOM.
	// This is a hackjob, but the show must go on.
	function getHeight() {
		if (file_path.includes("cs50_")) return 580;
		else if (file_path.includes("EUCIP")) return 540;
		return 900;
	}
	var height, width;
	if (mobileCheck()) {
		if (window.matchMedia("(orientation: portrait)").matches) {
			height = 634;
			width = window.screen.width;
		} else if (window.matchMedia("(orientation: landscape)").matches) {
			height = 350;
			width = 418;
		}
	} else {
		height = getHeight();
		width = 700;
	}

	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in make_iframe_window)
	var document_title = file_path ? file_name_from_path(file_path) : "Untitled";
	var win_title = document_title + " - PDF Viewer";
	// TODO: focus existing window if file is currently open?

	var $win = make_iframe_window({
		src: "programs/pdfviewer/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icons: iconsAtTwoSizes("doc"),
		title: win_title,
		outerWidth: width,
		outerHeight: height,
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: pdfviewer.exe(" + file_path + ")");
	return new Task($win);
}
PDFViewer.acceptsFilePaths = true;

function Picview(file_path) {
	function getImgDimentions() { //CLEAN UP AS HEIGHT IS RELATIVE
		// Get image dimentions [W,H]
		var imgDim = [0,0];
		var img = new Image();
		img.src = file_path;
		imgDim[0] = img.width;
		imgDim[1] = img.height;

		// Normalize width

		if (imgDim[0] <= 400) {
			imgDim[0] = 400;
			imgDim[1] = 260;
		} else if (imgDim[0] >= 1000) {
			imgDim[0] = 1000;
		}
		// Normalize height
		if (imgDim[1] <= 260) {
			imgDim[1] = 260;

		} else if (imgDim[0] >= 750) {
			imgDim[1] = 750;
		}

		// Fix for vertical images.
		// Multiplies the heigh with the original WxH ratio of the picture
		// to get the corrected height
		if (img.height > img.width) {
			const ratio = img.width / img.height;
			imgDim[0] = ratio * imgDim[1];
		}
		return imgDim;
	}

	var file_title = file_path ? file_name_from_path(file_path) : "Untitled";
	var win_title = file_title + " - PicView";

	var dimentions = getImgDimentions();

	var $win = make_iframe_window({
		src: "programs/picview/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icons: iconsAtTwoSizes("kodak-imaging"),
		title: win_title,
		outerWidth: dimentions[0],
		outerHeight: dimentions[1],
		resizable: true,
	});
	console.log("[USR] ibocse@crlab2-h032: picview.exe(" + file_path + ")");
	return new Task($win);
}
Picview.acceptsFilePaths = true;

function Network(file_path) {
	if (!file_path.includes("/Network")) return;

	if (file_path === "/Network/LAB02") {
		showMessageBox({iconID: 'error', title:'Error', message: 'Could not establish a connection to //LAB02/X01/X01_b . \n[Cause: 511 Network Authentication Required]'});
		return;
	}
	else {
		file_path = file_path.slice(9);
		var $win = make_iframe_window({
			src: "programs/netlogin/index.html" + (file_path ? ("?path=" + file_path) : ""),
			icons: iconsAtTwoSizes("network"),
			title: "Network Login",
			outerWidth: 400,
			outerHeight: 240,
			resizable: false,
		});
		console.log("[USR] ibocse@crlab2-h032: attempting login > //CCCNET/" + file_path + "/");
		return new Task($win);
	}
}
Network.acceptsFilePaths = true;

function openWithProgram(file_path) {
	if (file_path.includes("wolf3d")) {
		Wolf3d(file_path);
		return;
	}
	if (file_path.includes("pinball")) {
		Pinball(file_path);
		return;
	}
	if (file_path.includes("minesweeper")) {
		Minesweeper(file_path);
		return;
	}
	if (file_path.includes("diablo")) {
		Diablo(file_path);
		return;
	}
	if (file_path.includes("tombraider")) {
		TombRaider();
		return;
	}
	if (file_path.includes("minecraft")) {
		Minecraft();
		return;
	}
	if (file_path.includes("skifree")) {
		SkiFree();
		return;
	}
	if (file_path.includes("quake3")) {
		Quake3();
		return;
	} else {
		withFilesystem(function () {
			var fs = BrowserFS.BFSRequire('fs');
			fs.readFile(file_path, "utf8", function (error, data) {
				var program = data.split('\n').shift()
				var func = new Function(program);
				func();
				if (error) {
					alert("Failed to run executable: " + error);
					throw error;
				}
			});
		});
	}
	return;
}
openWithProgram.acceptsFilePaths = true;

function Paint(file_path) {
	var $win = make_iframe_window({
		src: "programs/jspaint/index.html",
		icons: iconsAtTwoSizes("paint"),
		// NOTE: in Windows 98, "untitled" is lowercase, but TODO: we should just make it consistent
		title: "untitled - Paint",
		outerWidth: 275,
		outerHeight: 400,
		minOuterWidth: 275,
		minOuterHeight: 400,
	});

	var contentWindow = $win.$iframe[0].contentWindow;

	var waitUntil = function (test, interval, callback) {
		if (test()) {
			callback();
		} else {
			setTimeout(waitUntil, interval, test, interval, callback);
		}
	};

	const systemHooks = {
		readBlobFromHandle: (file_path) => {
			return new Promise((resolve, reject) => {
				withFilesystem(() => {
					var fs = BrowserFS.BFSRequire("fs");
					fs.readFile(file_path, (err, buffer) => {
						if (err) {
							return reject(err);
						}
						const byte_array = new Uint8Array(buffer);
						const blob = new Blob([byte_array]);
						const file_name = file_path.replace(/.*\//g, "");
						const file = new File([blob], file_name);
						resolve(file);
					});
				});
			});
		},
		writeBlobToHandle: async (file_path, blob) => {
			const arrayBuffer = await blob.arrayBuffer();
			return new Promise((resolve, reject) => {
				withFilesystem(()=> {
					const fs = BrowserFS.BFSRequire("fs");
					const { Buffer } = BrowserFS.BFSRequire("buffer");
					const buffer = Buffer.from(arrayBuffer);
					fs.writeFile(file_path, buffer, (err)=> {
						if (err) {
							return reject(err);
						}
						resolve();
					});
				});
			});
		},
		setWallpaperCentered: (canvas) => {
			canvas.toBlob((blob) => {
				setDesktopWallpaper(blob, "no-repeat", true);
			});
		},
		setWallpaperTiled: (canvas) => {
			canvas.toBlob((blob) => {
				setDesktopWallpaper(blob, "repeat", true);
			});
		},
	};

	// it seems like I should be able to use onload here, but when it works (overrides the function),
	// it for some reason *breaks the scrollbar styling* in jspaint
	// I don't know what's going on there

	// contentWindow.addEventListener("load", function(){
	// $(contentWindow).on("load", function(){
	// $win.$iframe.load(function(){
	// $win.$iframe[0].addEventListener("load", function(){
	waitUntil(()=> contentWindow.systemHooks, 500, ()=> {
		Object.assign(contentWindow.systemHooks, systemHooks);

		let $help_window;
		contentWindow.show_help = () => {
			if ($help_window) {
				$help_window.focus();
				return;
			}
			$help_window = show_help({
				title: "Paint Help",
				contentsFile: "programs/jspaint/help/mspaint.hhc",
				root: "programs/jspaint/help",
			}).$help_window;
			$help_window.on("close", () => {
				$help_window = null;
			});
		};

		if (file_path) {
			// window.initial_system_file_handle = ...; is too late to set this here
			// contentWindow.open_from_file_handle(...); doesn't exist
			systemHooks.readBlobFromHandle(file_path).then(file => {
				if (file) {
					contentWindow.open_from_file(file, file_path);
				}
			}, (error) => {
				// this handler may not always called for errors, sometimes error message is shown via readBlobFromHandle
				contentWindow.show_error_message(`Failed to open file ${file_path}`, error);
			});
		}

		var old_update_title = contentWindow.update_title;
		contentWindow.update_title = () => {
			old_update_title();
			$win.title(contentWindow.document.title);
		};
	});
	console.log("[USR] ibocse@crlab2-h032: paint.exe(" + file_path + ")");
	return new Task($win);
}
Paint.acceptsFilePaths = true;

function Minesweeper() {
	var $win = make_iframe_window({
		src: "programs/minesweeper/index.html",
		icons: iconsAtTwoSizes("minesweeper"),
		title: "Minesweeper",
		innerWidth: 280,
		innerHeight: 320 + 21,
		resizable: false,
	});
	console.log("[USR] ibocse@crlab2-h032: WINMINE.exe()");
	return new Task($win);
}

function SoundRecorder(file_path) {
	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in make_iframe_window)
	var document_title = file_path ? file_name_from_path(file_path) : "Sound";
	var win_title = document_title + " - Sound Recorder";
	// TODO: focus existing window if file is currently open?
	var $win = make_iframe_window({
		src: "programs/sound-recorder/index.html" + (file_path ? ("?path=" + file_path) : ""),
		icons: iconsAtTwoSizes("speaker"),
		title: win_title,
		innerWidth: 270,
		innerHeight: 108 + 21,
		minInnerWidth: 270,
		minInnerHeight: 108 + 21,
	});
	console.log("[USR] ibocse@crlab2-h032: recorder.exe()");
	return new Task($win);
}
SoundRecorder.acceptsFilePaths = true;

function Solitaire() {
	var $win = make_iframe_window({
		src: "programs/js-solitaire/index.html",
		icons: iconsAtTwoSizes("solitaire"),
		title: "Solitaire",
		innerWidth: 585,
		innerHeight: 384 + 21,
	});
	console.log("[USR] ibocse@crlab2-h032: solitaire.exe()");
	return new Task($win);
}

function showScreensaver(iframeSrc) {
	const mouseDistanceToExit = 15;
	const $iframe = $("<iframe>").attr("src", iframeSrc);
	const $surface = $("<div>"); // interact to close
	$surface.css({
		position: "fixed",
		left: 0,
		top: 0,
		width: "100%",
		height: "100%",
		zIndex: $Window.Z_INDEX + 10000,
		cursor: "none",
		touchAction: "none",
	});
	$iframe.css({
		position: "fixed",
		left: 0,
		top: 0,
		width: "100%",
		height: "100%",
		zIndex: $Window.Z_INDEX + 9999,
		border: 0,
		pointerEvents: "none",
		backgroundColor: "black",
	});
	$surface.appendTo("body");
	$iframe.appendTo("body");
	const cleanUp = () => {
		$surface.remove();
		$iframe.remove();
		const prevent = (event) => {
			event.preventDefault();
		};
		$(window).on("contextmenu", prevent);
		setTimeout(() => {
			$(window).off("contextmenu", prevent);
			window.removeEventListener("keydown", keydownHandler, true);
		}, 500);
	};
	const keydownHandler = (event) => {
		// Trying to let you change the display or capture the output
		// not allowing Ctrl+PrintScreen etc. because no modifiers
		if (!(["F11", "F12", "ZoomToggle", "PrintScreen", "MediaRecord", "BrightnessDown", "BrightnessUp", "Dimmer"].includes(event.key))) {
			event.preventDefault();
			event.stopPropagation();
			cleanUp();
		}
	};
	let startMouseX, startMouseY;
	$surface.on("mousemove pointermove", (event) => {
		if (startMouseX === undefined) {
			startMouseX = event.pageX;
			startMouseY = event.pageY;
		}
		if (Math.hypot(startMouseX - event.pageX, startMouseY - event.pageY) > mouseDistanceToExit) {
			cleanUp();
		}
	});
	$surface.on("mousedown pointerdown touchstart", (event) => {
		event.preventDefault();
		cleanUp();
	});
	// useCapture needed for scenario where you hit Enter, with a desktop icon selected
	// (If it relaunches the screensaver, it's like you can't exit it!)
	window.addEventListener("keydown", keydownHandler, true);
	console.log("[USR] ibocse@crlab2-h032: showing screensaver");
}

function Pipes() {
	const options = { hideUI: true };
	showScreensaver(`programs/pipes/index.html#${encodeURIComponent(JSON.stringify(options))}`);
}

function FlowerBox() {
	showScreensaver("programs/3D-FlowerBox/index.html");
}

function CommandPrompt() {
	var $win = make_iframe_window({
		src: "programs/command/index.html",
		icons: iconsAtTwoSizes("msdos"),
		title: "MS-DOS Prompt",
		// TODO: default dimensions
		innerWidth: 640,
		innerHeight: 400,
		constrainRect(rect, x_axis, y_axis) {
			const char_width = 8;
			const char_height = 16;
			const border = ($win.outerWidth() - $win.$content.outerWidth()) / 2;
			const inner_rect = {
				x: rect.x + border,
				y: rect.y + border + $win.$titlebar.outerHeight(),
				width: rect.width - $win.outerWidth() + $win.$content.outerWidth(),
				height: rect.height - $win.outerHeight() + $win.$content.outerHeight(),
			};
			const new_inner_rect = {
				width: Math.floor(inner_rect.width / char_width) * char_width,
				height: Math.floor(inner_rect.height / char_height) * char_height,
			};
			const new_rect = {
				x: inner_rect.x - border,
				y: inner_rect.y - border - $win.$titlebar.outerHeight(),
				width: new_inner_rect.width + $win.outerWidth() - $win.$content.outerWidth(),
				height: new_inner_rect.height + $win.outerHeight() - $win.$content.outerHeight(),
			};
			if (x_axis === -1) {
				new_rect.x = rect.x + rect.width - new_rect.width;
			}
			if (y_axis === -1) {
				new_rect.y = rect.y + rect.height - new_rect.height;
			}
			return new_rect;
		},
		// TODO: make the API simpler / more flexible like:
		// constrainDimensions({ innerWidth, innerHeight }) {
		// 	const charWidth = 8;
		// 	const charHeight = 16;
		// 	innerWidth = Math.floor(innerWidth / charWidth) * charWidth;
		// 	innerHeight = Math.floor(innerHeight / charHeight) * charHeight;
		// 	return { innerWidth, innerHeight };
		// },
	});
	console.log("[USR] ibocse@crlab2-h032: cmd.exe()");
	return new Task($win);
}

function Calculator() {
	var $win = make_iframe_window({
		src: "programs/calculator/index.html",
		icons: iconsAtTwoSizes("calculator"),
		title: "Calculator",
		innerWidth: 256,
		innerHeight: 208 + 21,
		minInnerWidth: 256,
		minInnerHeight: 208 + 21,
	});
	console.log("[USR] ibocse@crlab2-h032: calc.exe()");
	return new Task($win);
}

function Pinball() {
	var $win = make_iframe_window({
		src: "programs/pinball/space-cadet.html",
		icons: iconsAtTwoSizes("pinball"),
		title: "3D Pinball for Windows - Space Cadet",
		innerWidth: 600,
		innerHeight: 416 + 20, // @TODO: where's this 20 coming from?
		minInnerWidth: 600,
		minInnerHeight: 416 + 20,
		// resizable: false, // @TODO (maybe) once gray maximized button is implemented
		override_alert: false, // to handle the alert as a fatal error, and to compensate for overzealous preventDefault()
	});
	const $splash = $("<div>").css({
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		background: "url(images/pinball-splash.png) no-repeat center center",
		backgroundColor: "black",
		zIndex: $Window.Z_INDEX + 6000,
	}).appendTo("body");
	setTimeout(() => {
		$splash.remove(); // just in case
	}, 5000);
	$win.$content.find("iframe").on("game-loaded", () => { // custom event dispatched from within the iframe
		$splash.remove();
	});
	$win.$content.find("iframe").on("game-load-failed", () => { // custom event dispatched from within the iframe
		$splash.remove();
		// on some systems, if the game fails to load,
		// it may result in the canvas showing through to the desktop behind the browser window
		// let's call it a feature, tie it in thematically,
		// and pretend like we did it on purpose, to baffle and amuse.
		// This happens for me on Chrome on Ubuntu with Xfce, when coming out of suspend.
		// It says "Could not create renderer / Couldn't find matching render driver"
		// It keeps happening with live reload, but stops on a regular reload, or duplicating the tab.
		$win.title("Wormhole Window - Space Cadet");
	});
	console.log("[USR] ibocse@crlab2-h032: pinball.exe()");
	return new Task($win);
}

function Explorer(address) {
	// TODO: DRY the default file names and title code (use document.title of the page in the iframe, in make_iframe_window)
	var document_title = address;
	var win_title = document_title;
	// TODO: focus existing window if folder is currently open
	var $win = make_iframe_window({
		src: "programs/explorer/index.html" + (address ? ("?address=" + encodeURIComponent(address)) : ""),
		icons: iconsAtTwoSizes("folder-open"),
		title: win_title,
		// this is based on one measurement, but it uses different sizes depending on the screen resolution,
		// and may be different for different Explorer window types (Microsoft Internet Explorer, "Exploring", normal Windows Explorer*),
		// and may store the window positions, even for different types or folders, so I might have a non-standard default size measurement.
		// *See different types (resized for posing this screenshot): https://imgur.com/nxAcT9C
		innerWidth: Math.min(856, innerWidth * 0.9),
		innerHeight: Math.min(547, innerHeight * 0.7),
	});
	console.log("[USR] ibocse@crlab2-h032: explorer.exe(" + address + ")");
	return new Task($win);
}
Explorer.acceptsFilePaths = true;

function VirtualMachine() {
	address = "localhost:5173";
	var win_title = "VMware - Sinclair OS";
	var $win = make_iframe_window({
		src: "programs/vmware/index.html" + (address ? ("?address=" + encodeURIComponent(address)) : ""),
		icons: iconsAtTwoSizes("vm"),
		title: win_title,
		innerWidth: Math.min(856, innerWidth * 0.9),
		innerHeight: Math.min(547, innerHeight * 0.7),
	});
	console.log("[USR] ibocse@crlab2-h032: vmware.exe()");
	return new Task($win);
}
VirtualMachine.acceptsFilePaths = true;

var webamp_bundle_loaded = false;
var load_winamp_bundle_if_not_loaded = function (includeButterchurn, callback) {
	// FIXME: webamp_bundle_loaded not actually set to true when loaded
	// TODO: also maybe handle already-loading-but-not-done
	if (webamp_bundle_loaded) {
		callback();
	} else {
		// TODO: parallelize (if possible)
		$.getScript("programs/winamp/lib/webamp.bundle.min.js", () => {
			if (includeButterchurn) {
				$.getScript("programs/winamp/lib/butterchurn.min.js", () => {
					$.getScript("programs/winamp/lib/butterchurnPresets.min.js", () => {
						callback();
					});
				});
			} else {
				callback();
			}
		});
	}
}

// from https://github.com/jberg/butterchurn/blob/master/src/isSupported.js
const isButterchurnSupported = () => {
	const canvas = document.createElement('canvas');
	let gl;
	try {
		gl = canvas.getContext('webgl2');
	} catch (x) {
		gl = null;
	}

	const webGL2Supported = !!gl;
	const audioApiSupported = !!(window.AudioContext || window.webkitAudioContext);

	return webGL2Supported && audioApiSupported;
};

let webamp;
let $webamp;
let winamp_task;
let winamp_interface;
let winamp_loading = false;
// TODO: support opening multiple files at once
function openWinamp(file_path) {
	const filePathToBlob = (file_path) => {
		return new Promise((resolve, reject) => {
			withFilesystem(function () {
				var fs = BrowserFS.BFSRequire("fs");
				fs.readFile(file_path, function (err, buffer) {
					if (err) {
						return reject(err);
					}
					const byte_array = new Uint8Array(buffer);
					const blob = new Blob([byte_array]);
					resolve(blob);
				});
			});
		});
	};

	const filePathToTrack = async (file_path) => {
		const blob = await filePathToBlob(file_path);
		const blob_url = URL.createObjectURL(blob);
		// TODO: revokeObjectURL
		const track = {
			url: blob_url,
			defaultName: file_name_from_path(file_path).replace(/\.[a-z0-9]+$/i, ""),
		};
		return track;
	};

	const whenLoaded = async () => {
		if ($webamp.css("display") === "none") {
			winamp_interface.unminimize();
		}

		winamp_interface.focus();

		if (file_path) {
			if (file_path.match(/(\.wsz|\.zip)$/i)) {
				const blob = await filePathToBlob(file_path);
				const url = URL.createObjectURL(blob);
				webamp.setSkinFromUrl(url);
			} else if (file_path.match(/(\.m3u|\.pls)$/i)) {
				openURLFile(file_path);
			// } else if (file_path.includes("/My Music/")) {
			// 	// This is hardcoded for performance reasons
			// 	var tracks = [
			// 		{url: "/My Music/better-off-alone.mp3"},
			// 		{url: "/My Music/Big Poppa.mp3"},
			// 		{url: "/My Music/big_mountain-baby_i_love_your_way.mp3"},
			// 		{url: "/My Music/blue.mp3"},
			// 		{url: "/My Music/Coolio - Gangsta's Paradise.mp3"},
			// 		{url: "/My Music/Juicy.mp3"},
			// 		{url: "/My Music/linkin_park-in_the_end.mp3"},
			// 		{url: "/My Music/linkin_park-numb.mp3"},
			// 		{url: "/My Music/Losing my religion.mp3"},
			// 		{url: "/My Music/Nirvana - Heart Shaped Box.mp3"},
			// 		{url: "/My Music/Radiohead - Creep.mp3"},
			// 		{url: "/My Music/smells like teen spirit.mp3"},
			// 		{url: "/My Music/STILL DRE.mp3"},
			// 	];

			// 	await webamp.appendTracks(tracks);
			} else {
				const track = await filePathToTrack(file_path);
				webamp.setTracksToPlay([track]);
			}
		}
		winamp_loading = false;
	}
	if (winamp_task) {
		whenLoaded()
		return;
	}
	if (winamp_loading) {
		return; // TODO: queue up files?
	}
	winamp_loading = true;

	// This check creates a WebGL context, so don't do it if you try to open Winamp while it's opening or open.
	// (Otherwise it will lead to "WARNING: Too many active WebGL contexts. Oldest context will be lost.")
	const includeButterchurn = isButterchurnSupported();

	load_winamp_bundle_if_not_loaded(includeButterchurn, function () {
		const webamp_options = {
			initialTracks: [
				{metaData: {artist: "Alice Deejay", title: "Better Off Alone"}, url: "/My Music/better-off-alone.mp3"},
				{metaData: {artist: "BIG Mountain", title: "Baby i Love Your Way"}, url: "/My Music/big_mountain-baby_i_love_your_way.mp3"},
				{metaData: {artist: "Coolio", title: "Gangsta's Paradise"}, url: "/My Music/Coolio - Gangsta's Paradise.mp3 "},
				{metaData: {artist: "Dr. Dre", title: "Still D.R.E."}, url: "/My Music/STILL DRE.mp3"},
				{metaData: {artist: "Eiffel 65", title: "Blue"}, url: "/My Music/blue.mp3"},
				{metaData: {artist: "Linkin Park", title: "In The End"}, url: "/My Music/linkin_park-in_the_end.mp3"},
				{metaData: {artist: "Linkin Park", title: "Numb"}, url: "/My Music/linkin_park-numb.mp3"},
				{metaData: {artist: "Nirvana", title: "Hearth Shaped Box"}, url: "/My Music/Nirvana - Heart Shaped Box.mp3"},
				{metaData: {artist: "Nirvana", title: "Smells Like Teen Spirit"}, url: "/My Music/smells like teen spirit.mp3"},
				{metaData: {artist: "Notorius B.I.G.", title: "Big Poppa"}, url: "/My Music/Big Poppa.mp3"},
				{metaData: {artist: "Notorious B.I.G.", title: "Juicy"}, url: "/My Music/Juicy.mp3"},
				{metaData: {artist: "Radiohead", title: "Creep"}, url: "/My Music/Radiohead - Creep.mp3"},
				{metaData: {artist: "R.E.M.", title: "Losing My Religion"}, url: "/My Music/Losing my religion.mp3"},

			],
			initialSkin: {
				url: "programs/winamp/skins/base-2.91.wsz",
			},
			availableSkins: [
				{ url: "programs/winamp/skins/ascii_amp3.7.wsz", name: "Ascii Amp" },
				{ url: "programs/winamp/skins/Microchip_2.wsz", name: "Microchip 2" },
				{ url: "programs/winamp/skins/Winamp3_Classified_v5.5.wsz", name: "Classified" },
				{ url: "programs/winamp/skins/Winamp98_plus_IE5.wsz", name: "98Plus" },
			  ],
			enableHotkeys: true,
			handleTrackDropEvent: (event) =>
				Promise.all(
					dragging_file_paths.map(filePathToTrack)
				),
			// TODO: filePickers
		};
		if (includeButterchurn) {
			webamp_options.__butterchurnOptions = {
				importButterchurn: () => Promise.resolve(window.butterchurn),
				getPresets: () => {
					const presets = window.butterchurnPresets.getPresets();
					return Object.keys(presets).map((name) => {
						return {
							name,
							butterchurnPresetObject: presets[name]
						};
					});
				},
				butterchurnOpen: true,
			};
			webamp_options.__initialWindowLayout = {
				main: { position: { x: 0, y: 0 } },
				equalizer: { position: { x: 0, y: 116 } },
				playlist: { position: { x: 0, y: 232 }, size: [0, 4] },
				milkdrop: { position: { x: 275, y: 0 }, size: [7, 12] }
			};
		}
		webamp = new Webamp(webamp_options);

		var visual_container = document.createElement("div");
		visual_container.classList.add("webamp-visual-container");
		visual_container.style.position = "absolute";
		visual_container.style.left = "0";
		visual_container.style.right = "0";
		visual_container.style.top = "0";
		visual_container.style.bottom = "0";
		visual_container.style.pointerEvents = "none";
		document.body.appendChild(visual_container);
		// Render after the skin has loaded.
		webamp.renderWhenReady(visual_container).then(() => {
			window.console && console.log("Webamp rendered");

			$webamp = $("#webamp");
			// Bring window to front, initially and when clicked
			$webamp.css({
				position: "absolute",
				left: 0,
				top: 0,
				zIndex: $Window.Z_INDEX++
			});

			const $eventTarget = $({});
			const makeSimpleListenable = (name) => {
				return (callback) => {
					const fn = () => {
						callback();
					};
					$eventTarget.on(name, fn);
					const dispose = () => {
						$eventTarget.off(name, fn);
					};
					return dispose;
				};
			};

			winamp_interface = {};
			winamp_interface.onFocus = makeSimpleListenable("focus");
			winamp_interface.onBlur = makeSimpleListenable("blur");
			winamp_interface.onClosed = makeSimpleListenable("closed");
			winamp_interface.getIconAtSize = (target_icon_size) => {
				if (target_icon_size !== 32 && target_icon_size !== 16) {
					target_icon_size = 32;
				}
				const img = document.createElement("img");
				img.src = getIconPath("winamp2", target_icon_size);
				return img;
			};
			winamp_interface.bringToFront = () => {
				$webamp.css({
					zIndex: $Window.Z_INDEX++
				});
			};
			winamp_interface.element = winamp_interface[0] = $webamp[0]; // for checking z-index in window switcher
			winamp_interface.hasClass = (className) => { // also for window switcher (@TODO: clean this stuff up)
				if (className === "focused") {
					return $webamp.hasClass("focused");
				}
				return false;
			};
			winamp_interface.focus = () => {
				if (!$webamp.hasClass("focused")) {
					$webamp.addClass("focused");
					winamp_interface.bringToFront();
					$eventTarget.triggerHandler("focus");
					// @TODO: focus last focused window/control?
					$webamp.find("#main-window [tabindex='-1']").focus();
				}
			};
			winamp_interface.blur = () => {
				if ($webamp.hasClass("focused")) {
					$webamp.removeClass("focused");
					$eventTarget.triggerHandler("blur");
					// TODO: really blur
				}
			};
			winamp_interface.minimize = () => {
				// TODO: are these actually useful or does webamp hide it?
				$webamp.hide();
			};
			winamp_interface.unminimize = () => {
				// more to the point does this work necessarily??
				$webamp.show();
				// $webamp.focus();
			};
			winamp_interface.close = () => {
				// not allowing canceling close event in this case (generally used *by* an application (for "Save changes?"), not outside of it)
				// TODO: probably something like winamp_task.close()
				// winamp_interface.triggerHandler("close");
				// winamp_interface.triggerHandler("closed");
				webamp.dispose();
				$webamp.remove();

				$eventTarget.triggerHandler("closed");

				webamp = null;
				$webamp = null;
				winamp_task = null;
				winamp_interface = null;
			};
			winamp_interface.getTitle = () => {
				let taskTitle = "Winamp 2.91";
				const $cell = $webamp.find(".playlist-track-titles .track-cell.current");
				if ($cell.length) {
					taskTitle = `${$cell.text()} - Winamp`;
					switch (webamp.getMediaStatus()) {
						case "STOPPED":
							taskTitle = `${taskTitle} [Stopped]`
							break;
						case "PAUSED":
							taskTitle = `${taskTitle} [Paused]`
							break;
					}
				}
				return taskTitle;
			};
			winamp_interface.setMinimizeTarget = () => {
				// dummy function; it won't animate to the minimize target anyway
				// (did Winamp on Windows 98 animate minimize/restore?)
			};
			// @TODO: this wasn't supposed to be part of the API, but it's needed for the taskbar
			winamp_interface.on = (event_name, callback) => {
				if (event_name === "title-change") {
					webamp.onTrackDidChange(callback);
				} else if (event_name === "icon-change") {
					// icon will never change
				} else {
					console.warn(`Unsupported event: ${event_name}`);
				}
			};

			mustHaveMethods(winamp_interface, windowInterfaceMethods);

			let raf_id;
			let global_pointerdown;

			winamp_task = new Task(winamp_interface);
			webamp.onClose(function () {
				winamp_interface.close();
				cancelAnimationFrame(raf_id);
				visualizerOverlay.fadeOutAndCleanUp();
			});
			webamp.onMinimize(function () {
				winamp_interface.minimize();
			});

			$webamp.on("focusin", () => {
				winamp_interface.focus();
			});
			$webamp.on("focusout", () => {
				// could use relatedTarget, no?
				if (
					!document.activeElement ||
					!document.activeElement.closest ||
					!document.activeElement.closest("#webamp")
				) {
					winamp_interface.blur();
				}
			});

			const visualizerOverlay = new VisualizerOverlay(
				$webamp.find(".gen-window canvas")[0],
				{ mirror: true, stretch: true },
			);


			// WHY WAS THIS HERE?? I HATE IT
			// TODO: replace with setInterval
			// Note: can't access butterchurn canvas image data during a requestAnimationFrame here
			// because of double buffering
			// const animate = () => {
			// 	const windowElements = $(".os-window, .window:not(.gen-window)").toArray();
			// 	windowElements.forEach(windowEl => {
			// 		if (!windowEl.hasOverlayCanvas) {
			// 			visualizerOverlay.makeOverlayCanvas(windowEl);
			// 			windowEl.hasOverlayCanvas = true;
			// 		}
			// 	});

			// 	if (webamp.getMediaStatus() === "PLAYING") {
			// 		visualizerOverlay.fadeIn();
			// 	} else {
			// 		visualizerOverlay.fadeOut();
			// 	}
			// 	raf_id = requestAnimationFrame(animate);
			// };
			// raf_id = requestAnimationFrame(animate);
			// $webamp.setVolume(0);

			whenLoaded()
		}, (error) => {
			// TODO: show_error_message("Failed to load Webamp:", error);
			alert("Failed to render Webamp:\n\n" + error);
			console.error(error);
		});
	});
	console.log("[USR] ibocse@crlab2-h032: winamp.exe(" + file_path + ")");
}
openWinamp.acceptsFilePaths = true;

/*
function saveAsDialog(){
	var $win = new $Window();
	$win.title("Save As");
	return $win;
}
function openFileDialog(){
	var $win = new $Window();
	$win.title("Open");
	return $win;
}
*/

function openURLFile(file_path) {
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.readFile(file_path, "utf8", function (err, content) {
			if (err) {
				return alert(err);
			}
			// it's supposed to be an ini-style file, but lets handle files that are literally just a URL as well, just in case
			var match = content.match(/URL\s*=\s*([^\n\r]+)/i);
			var url = match ? match[1] : content;
			if (!file_path)  console.log("[USR] ibocse@crlab2-h032: explorer.exe()");
			else console.log("[USR] ibocse@crlab2-h032: explorer.exe(" + file_path + ")");
			// Explorer(url);
			open(url);
		});
	});
}
openURLFile.acceptsFilePaths = true;

function openThemeFile(file_path) {
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.readFile(file_path, "utf8", function (err, content) {
			if (err) {
				return alert(err);
			}
			loadThemeFromText(content);
			try {
				localStorage.setItem("desktop-theme", content);
				localStorage.setItem("desktop-theme-path", file_path);
			} catch (error) {
				// no local storage
			}
		});
	});
}
openThemeFile.acceptsFilePaths = true;

// Note: extensions must be lowercase here. This is used to implement case-insensitive matching.
var file_extension_associations = {
	// Fonts:
	// - eot (Embedded OpenType)
	// - otf (OpenType)
	// - ttf (TrueType)
	// - woff (Web Open Font Format)
	// - woff2 (Web Open Font Format 2)
	// - (also svg but that's mainly an image format)

	// Misc binary:
	// - wasm (WebAssembly)
	// - o (Object file)
	// - so (Shared Object)
	// - dll (Dynamic Link Library)
	// - exe (Executable file)
	// - a (static library)
	// - lib (static library)
	// - pdb (Program Debug database)
	// - idb (Intermediate Debug file)
	// - bcmap (Binary Character Map)
	// - bin (generic binary file extension)

	// Text:
	// "": Notepad, // bare files such as LICENSE, Makefile, CNAME, etc.
	"": Network,
	ahk: Notepad,
	ai: Paint,
	bat: Notepad,
	check_cache: Notepad,
	cmake: Notepad,
	cmd: Notepad,
	conf: Notepad,
	cpp: Notepad,
	css: Notepad,
	d: Notepad,
	editorconfig: Notepad,
	filters: Notepad,
	gitattributes: Notepad,
	gitignore: Notepad,
	// gitrepo: Notepad,
	h: Notepad,
	hhc: Notepad,
	hhk: Notepad,
	html: Notepad,
	ini: Notepad,
	js: Notepad,
	json: Notepad,
	log: Notepad,
	make: Notepad,
	map: Notepad,
	marks: Notepad,
	md: Notepad,
	prettierignore: Notepad,
	properties: Notepad,
	rc: Notepad,
	rsp: Notepad,
	sh: Notepad,
	ts: Notepad,
	txt: Notepad,
	vcxproj: Notepad,
	webmanifest: Notepad,
	xml: Notepad,
	yml: Notepad,

	sql: Notepad,
	java: Notepad,
	gradle: Notepad,
	pro: Notepad,
	iml: Notepad,
	kt: Notepad,
	class: Notepad,
	scss: Notepad,
	php: Notepad,
	py: Notepad,
	shtml: Explorer,

	// Images:
	png: Picview,
	gif: Picview,
	jpeg: Picview,
	jpg: Picview,

	bmp: Paint,
	cur: Paint,
	eps: Paint,
	// gif: Paint,
	icns: Paint,
	ico: Paint,
	// jpeg: Paint,
	// jpg: Paint,
	kra: Paint,
	pbm: Paint,
	pdn: Paint,
	pgm: Paint,
	// png: Paint,
	pnm: Paint,
	ppm: Paint,
	ps: Paint,
	psd: Paint,
	svg: Paint,
	tga: Paint,
	tif: Paint,
	tiff: Paint,
	webp: Paint,
	xbm: Paint,
	xcf: Paint,
	xcfbz2: Paint,
	xcfgz: Paint,
	xpm: Paint,

	// Winamp Skins:
	wsz: openWinamp, // winamp skin zip
	//zip: openWinamp, // MIGHT be a winamp skin zip, so might as well for now

	// Audio:
	// wav: SoundRecorder,
	wav: openWinamp,
	mp3: openWinamp,
	ogg: openWinamp,
	wma: openWinamp,
	m4a: openWinamp,
	aac: openWinamp,
	flac: openWinamp,
	mka: openWinamp,
	mpc: openWinamp,
	// "mp+": openWinamp,

	// Playlists:
	m3u: openURLFile,
	pls: openWinamp,

	// Programs:
	exe: openWithProgram,

	// Misc:
	htm: Explorer,
	html: Explorer,
	url: openURLFile,
	theme: openThemeFile,
	themepack: openThemeFile,
	pdf: PDFViewer,
	git: openURLFile,
};

// Note: global systemExecuteFile called by explorer
function systemExecuteFile(file_path) {
	// execute file with default handler
	// like the START command in CMD.EXE

	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.stat(file_path, function (err, stats) {
			if (err) {
				return alert("Failed to get info about " + file_path + "\n\n" + err);
			}
			if (stats.isDirectory()) {
				Explorer(file_path);
			} else {
				var file_extension = file_extension_from_path(file_path);
				var program = file_extension_associations[file_extension.toLowerCase()];
				if (program) {
					if (!program.acceptsFilePaths) {
						alert(program.name + " does not support opening files via the virtual filesystem yet");
						return;
					}
					program(file_path);
				} else {
					alert("No program is associated with " + file_extension + " files");
				}
			}
		});
	});
}

// TODO: base all the desktop icons off of the filesystem
// Note: `C:\Windows\Desktop` doesn't contain My Computer, My Documents, Network Neighborhood, Recycle Bin, or Internet Explorer,
// or Connect to the Internet, or Setup MSN Internet Access,
// whereas `Desktop` does (that's the full address it shows; it's one of them "special locations")
var add_icon_not_via_filesystem = function (options) {
	folder_view.add_item(new FolderViewItem({
		icons: {
			// @TODO: know what sizes are available
			[DESKTOP_ICON_SIZE]: getIconPath(options.iconID, DESKTOP_ICON_SIZE),
		},
		...options,
	}));
};
add_icon_not_via_filesystem({
	title: "My Computer",
	iconID: "my-computer",
	open: function () { systemExecuteFile("/"); },
	// file_path: "/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "Recycle Bin",
	iconID: "recycle-bin",
	open: function () { systemExecuteFile("/Recycle Bin"); },
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "My Documents",
	iconID: "my-documents-folder",
	open: function () { systemExecuteFile("/My Documents"); },
	// file_path: "/My Documents/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "My Music",
	iconID: "cdmusic",
	open: function () { systemExecuteFile("/My Music"); },
	// file_path: "/My Music/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "Network",
	iconID: "network",
	open: function () { systemExecuteFile("/Network"); },
	// file_path: "/Network/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "My Pictures",
	iconID: "kodak-imaging",
	open: function () { systemExecuteFile("/My Pictures"); },
	// file_path: "/My Pictures/",
	is_system_folder: true,
});

// Programs
add_icon_not_via_filesystem({
	title: "Internet Explorer",
	iconID: "internet-explorer",
	open: function () { Explorer("https://www.google.com/"); }
});
add_icon_not_via_filesystem({
	title: "Paint",
	iconID: "paint",
	open: Paint,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Minesweeper",
	iconID: "minesweeper",
	open: Minesweeper,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Sound Recorder",
	iconID: "speaker",
	open: SoundRecorder,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Solitaire",
	iconID: "solitaire",
	open: Solitaire,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Notepad",
	iconID: "notepad",
	open: Notepad,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Winamp",
	iconID: "winamp2",
	open: openWinamp,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "3D Pipes",
	iconID: "pipes",
	open: Pipes,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "3D Flower Box",
	iconID: "pipes",
	open: FlowerBox,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "VMware 2.0",
	iconID: "vm",
	open: function () { VirtualMachine(); }
});
add_icon_not_via_filesystem({
	title: "Diablo",
	iconID: "diablo1",
	open: function () { Diablo(); },
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Pinball",
	iconID: "pinball",
	open: Pinball,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Wolfenstein",
	iconID: "wolf-3d",
	open: function () { Wolf3d(); },
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Tomb Raider",
	iconID: "tomb-raider",
	open: function () { TombRaider(); },
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Quake III",
	iconID: "quake3",
	open: function () { Quake3(); },
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Minecraft",
	iconID: "minecraft",
	open: function () { Minecraft(); },
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Calculator",
	iconID: "calculator",
	open: Calculator,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Terminal",
	iconID: "console",
	open: CommandPrompt,
	shortcut: true
});

add_icon_not_via_filesystem({
	title: "CV (EN).pdf",
	iconID: "cert-v",
	open: function () { systemExecuteFile("/My Documents/CV (EN).pdf"); },
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "CV (RO).pdf",
	iconID: "cert-v",
	open: function () { systemExecuteFile("/My Documents/CV (RO).pdf"); },
	shortcut: true
});


folder_view.arrange_icons();

function iconsAtTwoSizes(iconID) {
	return {
		16: `images/icons/${iconID}-16x16.png`,
		32: `images/icons/${iconID}-32x32.png`,
	};
}
