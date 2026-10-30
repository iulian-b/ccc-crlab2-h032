import { defineConfig } from "vite";
import filesystem_index from "./scripts/filesystem-index.js";

// Serves filesystem-index.json fresh on every request, so files added to the drive folders show up without a rebuild.
const filesystem_index_plugin = {
	name: "filesystem-index",
	configureServer(server) {
		server.middlewares.use("/filesystem-index.json", (req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(filesystem_index.make_filesystem_index(server.config.root)));
		});
	},
};

export default defineConfig({
	// A static multi-page site: missing files should 404 instead of falling back to index.html.
	appType: "mpa",
	plugins: [filesystem_index_plugin],
	server: {
		port: 1998,
		strictPort: true,
	},
	// `npm run preview` serves the output of `npm run build`
	build: {
		outDir: "dist",
	},
	preview: {
		port: 1998,
		strictPort: true,
	},
});
