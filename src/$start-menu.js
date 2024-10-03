var $start_menu = $(".start-menu");
var $start_selection = $(".start-btn");
$start_menu.hide();
var $start_content = document.getElementsByClassName("start-menu-content");

var open_start_menu = function () {
	$start_button.addClass("selected");
	$start_menu.attr("hidden", null);
	$start_menu.slideDown(100); // DOWN AS IN UP (stupid jQuery)
	$start_menu.css({ zIndex: ++$Window.Z_INDEX + 5001 });
};
var close_start_menu = function () {
	$start_button.removeClass("selected");
	$start_menu.attr("hidden", "hidden");
	$start_menu.hide();
};
var toggle_start_menu = function () {
	if ($start_menu.is(":hidden")) {
		open_start_menu();
	} else {
		close_start_menu();
	}
};

const update_dialog = () => {
	const $w = $Window({
		title: "Sinclair OS-9", resizable: false, maximizeButton: false, minimizeButton: false,
		icons: {
			32: "/images/icons/sinclair-updates-32x32.png",
			16: "/images/icons/sinclair-updates-16x16.png",
		},
	});
	$w.$content.html(`<p><img src='/images/banner.png'></p>`);
	

	// $w.$Button("Ok", () => $w.close()).css({ width: 100 });

	return $w;
};


var $start_button = $(".start-button");
$start_button.on("pointerdown", function () {
	toggle_start_menu();
});

$("body").on("pointerdown", function (e) {
	if ($(e.target).closest(".start-menu, .start-button").length === 0) {
		close_start_menu();
	}
});
// Note: A lot of the time it's good to use focusout (in jQuery, or else blur with useCapture?[1]) as opposed to 
// That might be the case here as well, but maybe not since programs opening might grab focus and that probably shouldn't close the start menu
// Although at the operating system level it would probably prevent focus switching in the first place, so maybe we could do that
// The point being this is an operating system control and so it may warrant special handling,
// but generally I'd recommend making a control focusable and detecting loss of focus as in this answer:
// [1]: https://stackoverflow.com/a/38317768/2624876

$(window).on("keydown", function (e) {
	if (e.which === 27) { // Esc to close
		close_start_menu();
	}
	if (e.which === 17) { // lWin to open
		toggle_start_menu();
	}
});

// Buttons
document.getElementById('start_btn_update').addEventListener("click", function() {
	console.log("[USR] ibocse@crlab2-h032: Opened sysyem about_dialog()");
	update_dialog();
});
document.getElementById('start_btn_programs').addEventListener("click", function() {
	Explorer("/Program Files/");
});
document.getElementById('start_btn_favorites').addEventListener("click", function() {
	Explorer("/Favorites");
});
document.getElementById('start_btn_documents').addEventListener("click", function() {
	Explorer("/My Documents/");
});
document.getElementById('start_btn_settings').addEventListener("click", function() {
	alert("SETT");
});
document.getElementById('start_btn_find').addEventListener("click", function() {
	alert("FIND");
});
document.getElementById('start_btn_help').addEventListener("click", function() {
	console.log("[USR] ibocse@crlab2-h032: Opened help page");
	open("https://github.com/iulian-b/ccc-crlab2-h032");
});
document.getElementById('start_btn_run').addEventListener("click", function() {
	console.log("[USR] ibocse@crlab2-h032: Opened run()");
	openRunDialog();
});
document.getElementById('start_btn_logoff').addEventListener("click", function() {
	console.log("[SYS] ibocse@crlab2-h032: System log off");
    document.documentElement.innerHTML = '<body style="background-color:black;"></body>';
});
document.getElementById('start_btn_shutdown').addEventListener("click", function() {
	console.log("[SYS] ibocse@crlab2-h032: System shut down");
    document.documentElement.innerHTML = '<body style="background-color:black;"></body>';
});

