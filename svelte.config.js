import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import vercel from '@sveltejs/adapter-vercel';
import staticAdapter from '@sveltejs/adapter-static';

const target = process.env.BUILD_TARGET;
const isStaticTarget = target === 'desktop' || target === 'ios';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess(), mdsvex()],
  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: isStaticTarget
      ? staticAdapter({ fallback: 'index.html' })
      : vercel(),

    // Electron: on ne veut pas de SW
    serviceWorker: { register: false }
  }
};

export default config;