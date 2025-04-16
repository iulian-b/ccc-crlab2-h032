#! /usr/bin/env node
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var symLinks = {};
var ignoreFiles = ['.github', '.gitignore', '.gitattributes', '.idea', '.vscode', 'audio', 'font', 'help', 'images', 'lib', 'node_modules', 'src',
    'tests', 'extract-icons.sh', 'browserconfig.xml','package.json','package-lock.json','playwright.config.ts','site.webmanifest','theme.css',
    'make_http_index.js','layout.css','index.html','favico*','cspell.json','classic.css', 'pull-libs.js'];
ignoreFiles += ['android-chrome-192x192.png', 'android-chrome-256x256.png', 'apple-touch-icon.png','apple-touch-icon-57x57.png',
    'apple-touch-icon-57x57-precomposed.png','apple-touch-icon-60x60.png','apple-touch-icon-60x60-precomposed.png','apple-touch-icon-72x72.png',
    'apple-touch-icon-72x72-precomposed.png','apple-touch-icon-76x76.png','apple-touch-icon-76x76-precomposed.png','apple-touch-icon-114x114.png',
    'apple-touch-icon-114x114-precomposed.png','apple-touch-icon-120x120.png','apple-touch-icon-120x120-precomposed.png','apple-touch-icon-144x144.png',
    'apple-touch-icon-144x144-precomposed.png','apple-touch-icon-152x152.png','apple-touch-icon-152x152-precomposed.png','apple-touch-icon-180x180.png',
    'apple-touch-icon-180x180-precomposed.png','apple-touch-icon-precomposed.png','favicon.ico','favicon-16x16.png','favicon-32x32.png','mstile-70x70.png',
    'mstile-144x144.png','mstile-150x150.png','mstile-310x150.png','mstile-310x310.png','safari-pinned-tab.svg']
function rdSync(dpath, tree, name) {
    var files = fs.readdirSync(dpath);
    files.forEach(function (file) {
        // ignore non-essential directories / files
        if (ignoreFiles.indexOf(file) !== -1 || file[0] === '.') {
            return;
        }
        var fpath = dpath + "/" + file;
        try {
            // Avoid infinite loops.
            var lstat = fs.lstatSync(fpath);
            if (lstat.isSymbolicLink()) {
                if (!symLinks[lstat.dev]) {
                    symLinks[lstat.dev] = {};
                }
                // Ignore if we've seen it before
                if (symLinks[lstat.dev][lstat.ino]) {
                    return;
                }
                symLinks[lstat.dev][lstat.ino] = true;
            }
            var fstat = fs.statSync(fpath);
            if (fstat.isDirectory()) {
                var child = tree[file] = {};
                rdSync(fpath, child, file);
            }
            else {
                tree[file] = null;
            }
        }
        catch (e) {
            // Ignore and move on.
        }
    });
    return tree;
}
var fsListing = JSON.stringify(rdSync(process.cwd(), {}, '/'));
if (process.argv.length === 3) {
    var fname = process.argv[2];
    var parent_1 = path.dirname(fname);
    while (!fs.existsSync(parent_1)) {
        fs.mkdirSync(parent_1);
        parent_1 = path.dirname(parent_1);
    }
    fs.writeFileSync(fname, fsListing, { encoding: 'utf8' });
}
else {
    console.log(fsListing);
}
//# sourceMappingURL=make_http_index.js.map
