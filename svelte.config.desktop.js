import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import staticAdapter from '@sveltejs/adapter-static';

export default {
  preprocess: [vitePreprocess(), mdsvex()],
  extensions: ['.svelte', '.svx'],
  kit: {
    adapter: staticAdapter({ fallback: 'index.html' }),
    serviceWorker: { register: false }
  }
};