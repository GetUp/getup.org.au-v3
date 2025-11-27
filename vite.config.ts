import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: ['dlo-dev.529broome.online'],
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), resolve('content')]
		}
	},
	optimizeDeps: {
		// iframe-resizer has an ESM entry that can trip Vite's optimizer;
		// load it at runtime instead.
		exclude: ['iframe-resizer', '@iframe-resizer/child']
	},
	ssr: {
		noExternal: ['iframe-resizer', '@iframe-resizer/child']
	}
});
