* File save and open dialogs

* Integrate Paint better

	* Windows that pop out; will need to display graphics via data URIs or canvases, and rely only on inline styles (or `<style scoped>`?) and the shared styles

		* Could *maybe* use [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) for `<img>`s, but all styles (that aren't shared) would have to be inline, and I think it would be better just to try to make everything canvases


* Try integrating arbitrary applications by emulating Windows 98 on the webpage [with v86](https://github.com/copy/v86/blob/master/docs/api.md),
with an X server installed in the VM, and acting as an X client externally??
And integrating a virtual filesystem??
That would be undoubtedly cool, but idk how hard it might be,
and especially what data channels are available between the VM and the host.
Partially [inspired by OS.js](https://www.youtube.com/watch?v=c0safRR0ldM&index=16&list=PL74DE0E481419C259).

-----------------------------------------------------------
-START
--ADD FAVORITES CONTENT
--SETTINGS
--FIND 

BSOD screen
VM
GAMES.
VIDEO PLAYER
FIX Mobile viewport

----------------------------------------------------------
RES:
https://os-gui.js.org/demo/test.html
https://win98icons.alexmeub.com/
https://benwiley4000.github.io/win95-media-player/
https://github.com/React95/React95/tree/master/packages/icons	
https://int10h.org/oldschool-pc-fonts/fontlist/