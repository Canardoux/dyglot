// svelte.config.base.js
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: [vitePreprocess(), mdsvex()],
  extensions: ['.svelte', '.svx'],

  kit: {
    // on met juste les trucs réellement communs
    serviceWorker: { register: false }
  }
};
