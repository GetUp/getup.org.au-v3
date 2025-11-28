import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: ({ status, path, referrer, message }) => {
				// Ignore 404s for external/missing pages during prerender
				if (status === 404) {
					console.warn(`Ignoring 404: ${path} (linked from ${referrer})`);
					return;
				}
				throw new Error(message);
			},
			handleMissingId: ({ id, path, message }) => {
				// Ignore missing anchor IDs during prerender
				console.warn(`Ignoring missing anchor: #${id} on ${path}`);
			}
		}
	}
};

export default config;
