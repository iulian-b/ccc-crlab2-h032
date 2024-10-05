# ![1728121822598](images/README/1728121822598.png)ccc-crlab2-h032

A web-OS inspired by Windows 98 and built on top of [98.js](https://github.com/1j01/98).

This project was made with the intention of being my profile/presentation/cv on [my website](https://ibocse.info).

## Features

Most of the original 98.js features were kept as they were or slightly modified to better suit this project.
To read more about them, refer to the original [98.js README](https://github.com/1j01/98/blob/master/README.md#-98js).

As far as features that were added by me:

* ![1728122346763](images/README/1728122346763.png) [NetLogin](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/programs/netlogin): used to authenticate when accesing network endpoints in `/Networks` (it's all fake, there's nothing there to access, but it adds a touch of *immersiveness*)
* ![1728122395806](images/README/1728122395806.png) [PdfViewer](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/programs/pdfviewer): Used to view `.pdf` files
* ![1728122408057](images/README/1728122408057.png) [PicView](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/programs/picview): Used to view `.png`, `.jpg`, `.gif`, and `.bmp` files
* ![1728122434872](images/README/1728122434872.png) [Run](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/programs/run): A recreation of the Windows 98 [Run dialog](https://perishablepress.com/wp/wp-content/images/2007/misc-chunks/run-command.png)
* ![1728122449412](images/README/1728122449412.png) [VMware](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/programs/vmware): A fake virtualization software (!no affiliation with VMware LLC!). It is basically just a stripped-down 98.js Explorer that opens on the webiste itself
* ![1728123166667](images/README/1728123166667.png) Panic: a fake Kernel Panic screen easter egg
* ![1728123250378](images/README/1728123250378.png) [Bootloader](https://github.com/iulian-b/ccc-crlab2-h032/blob/main/src/%24bootloader.js): A fake Linux-style bootstrap sequence which runs on the first visit
* ![1728123345562](images/README/1728123345562.png) [Icons](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/images/icons): Changed and added a bunch of W98 inspired icons. [win98icons]([https://](https://win98icons.alexmeub.com/)) and [React95](https://github.com/React95/React95/tree/master/packages/icons) were used whenever i had the chance, as they are both great repositories, while other were made manually.
* ![1728123620289](images/README/1728123620289.png) [Start Menu](https://github.com/iulian-b/ccc-crlab2-h032/blob/main/src/%24start-menu.js): Finished the start menu that was left unfinished in 98.js, adding an About dialog, shortcuts to various directories,  Log-Off and Shutdown features
* ![1728123795203](images/README/1728123795203.png) ~~[CRT](https://github.com/iulian-b/ccc-crlab2-h032/blob/main/src/%crt.css):~~ ~~Added a CRT effect to the screen~~ (Currently rethinking this addition)
* ![1728124031149](images/README/1728124031149.png) [Sounds](https://github.com/iulian-b/ccc-crlab2-h032/tree/main/audio): Added some sounds (boot, desktop, shutdown)
* Changes to the way the directory tree works
* Some other minor fixes and changes that i can't recall...

## Demo

You can view a live demo at my [website](https://ibocse.info).
In case something goes wrong ~~(as intended)~~, clear Local Storage on your browser and refresh the page.

## TODO

* Add Desktop Login screen, with maybe a second "desktop" to choose from
* Add some stuff if `/Favorites/`
* StartMenu - Find
* StartMenu - Settings
* A Video Player: 98.js's README mentioned [win-95-media-player](https://benwiley4000.github.io/win95-media-player/), but i remain open to other options.
* Games: Something like [Emupedia](https://github.com/Emupedia/emupedia.github.io/tree/master), and maybe some of the JS games i made in highschool (if i still have them)
* Add more audio files (i already have some, i just need some time choosing and editing them)
* Fix Audio: autoplay hasn't been a thing [[1]](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay#value), [[2]](https://stackoverflow.com/a/62720714) since tumblr and myspace apparently
* Extend Picview and PDFview with Filepicker dialogs
* Clean up all of the unused stuff from 98.js (as in not used by me)
* Add digitalis.exe

## Credits and Licence

Credits for all of the 98.js elements goes to [Isaiah Odhner](https://github.com/1j01) a.k.a. *1j01*.

As far as licensing goes, [98.js' licence](https://github.com/1j01/98/tree/master?tab=readme-ov-file#license) is:

> Not yet licensed. This project is currently [source-available / shared source](https://en.wikipedia.org/wiki/Source-available_software) but not [open source](https://en.wikipedia.org/wiki/Open-source_software).

So this project shall stay the same, as i do not want to infringe on the right of the original owner.
