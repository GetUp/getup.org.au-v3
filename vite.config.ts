import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { resolve } from 'path';
import mkcert from 'vite-plugin-mkcert';

// Check if HTTPS should be enabled via environment variable
const useHttps = process.env.VITE_HTTPS === 'true';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		...(useHttps ? [mkcert()] : [])
	],
	server: {
		port: 3000, // Set your desired port here
		allowedHosts: ['dlo-dev.529broome.online'],
		https: useHttps,
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), resolve('content')]
		}
	},
	optimizeDeps: {
		// iframe-resizer has an ESM entry that can trip Vite's optimizer;
		// load it at runtime instead.
		exclude: ['@iframe-resizer/parent', '@iframe-resizer/child']
	},
	ssr: {
		noExternal: ['@iframe-resizer/parent', '@iframe-resizer/child']
	}
});
