import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import vercel from '@sveltejs/adapter-vercel';
import staticAdapter from '@sveltejs/adapter-static';

const target = process.env.BUILD_TARGET;

export default {
  kit: {
    adapter:
      target === 'ios'
        ? staticAdapter({
            fallback: 'index.html' // SPA fallback for Capacitor WebView routing
          })
        : vercel(),

    // Important when using @vite-pwa/sveltekit + virtual:pwa-register
    serviceWorker: {
      register: false
    }
  }
};

/** @type {import('@sveltejs/kit').Config} */
export const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: { adapter: adapter(),
		  serviceWorker: {
    register: false
  }

	},
	extensions: ['.svelte', '.svx']
};


