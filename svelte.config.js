/*import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import vercel from '@sveltejs/adapter-vercel';
import staticAdapter from '@sveltejs/adapter-static';

const target = process.env.BUILD_TARGET || process.env.VITE_BUILD_TARGET || '';
const isStatic = target === 'ios' || target === 'desktop';

export default {
  preprocess: [vitePreprocess(), mdsvex()],
  extensions: ['.svelte', '.svx'],
  kit: {
    adapter: isStatic ? staticAdapter({ fallback: 'index.html' }) : vercel(),
    serviceWorker: { register: false }
  }
};
*/

// svelte.config.js
// svelte.config.js
import ios from './svelte.config.ios.js';
import desktop from './svelte.config.desktop.js';
import web from './svelte.config.web.js';

const target = process.env.BUILD_TARGET;

export default target === 'ios'
  ? ios
  : target === 'desktop'
    ? desktop
    : web;