import { mdsvex } from 'mdsvex';
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