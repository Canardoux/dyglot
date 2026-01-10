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
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import vercel from '@sveltejs/adapter-vercel';
import staticAdapter from '@sveltejs/adapter-static';

const target = process.env.BUILD_TARGET; // 'desktop' | 'ios' | undefined
console.log('[svelte.config] BUILD_TARGET =', process.env.BUILD_TARGET);
const isStatic = target === 'desktop' || target === 'ios';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess(), mdsvex()],
  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: isStatic
      ? staticAdapter({ fallback: 'index.html' })
      : vercel(),

    // Important: desktop/ios => on ne veut pas de SW auto
    serviceWorker: {
      register: !isStatic
    }
  }
};

export default config;