// Builds filesystem-index.json: the file listing BrowserFS uses for the desktop's virtual C: drive.
// The dev server (vite.config.mjs) serves it fresh on every request; the build (scripts/build.js) writes it into dist/.
// Usage: node scripts/filesystem-index.js [root] [out.json]   (prints to stdout without out.json)

const fs = require("fs");
const path = require("path");

// Only these top-level folders make up the drive; the rest of the site (programs, lib, src, ...) isn't browsable.
const drive_folders = ["Desktop", "Favorites", "Games", "My Documents", "My Music", "My Pictures", "Network", "Program Files", "Recycle Bin"];
// The desktop and Start menu open these, so they exist even when there's nothing in them.
const always_present = ["Desktop", "Favorites", "My Documents", "Program Files"];
const ignored_names = /^(\.|desktop\.ini$|thumbs\.db$)/i;

function list_folder(dir) {
	const tree = {};
	const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
	for (const entry of entries) {
		if (ignored_names.test(entry.name)) {
			continue;
		}
		tree[entry.name] = entry.isDirectory() ? list_folder(path.join(dir, entry.name)) : null;
	}
	return tree;
}

function make_filesystem_index(root) {
	const index = {};
	for (const folder of drive_folders) {
		const dir = path.join(root, folder);
		if (fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
			index[folder] = list_folder(dir);
		} else if (always_present.includes(folder)) {
			index[folder] = {};
		}
	}
	return index;
}

module.exports = { make_filesystem_index };

if (require.main === module) {
	const [root = ".", out_file] = process.argv.slice(2);
	const json = JSON.stringify(make_filesystem_index(root), null, "\t");
	if (out_file) {
		fs.writeFileSync(out_file, json + "\n");
	} else {
		console.log(json);
	}
}
