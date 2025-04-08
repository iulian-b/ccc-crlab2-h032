let trayIcon = document.getElementById('volume-tray-icon');
const loopAudio = new Audio('../audio/LOOP.wav');
const bootAudio = new Audio('../audio/BOOT.wav');
const panicAudio = new Audio('../audio/PANIC.wav');
loopAudio.volume = 0.2;
bootAudio.volume = 0.2;
panicAudio.volume = 1.0;
let muted = false;

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

// Kernel panic
function audioPanic() {
    // Play audio
    bootAudio.pause();
    loopAudio.pause();
    panicAudio.play();
}

// Mute tray icon
// trayIcon.addEventListener('click', () => {
//     if (webamp.getMediaStatus() === "PLAYING") {
//         console.log("Playing");
//         console.log(webamp.media._source._audio.volume=0);
//     }
// });