// svelte.config.js
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const target = process.env.BUILD_TARGET;

console.log('[svelte.config] BUILD_TARGET =', target);

function adapterForTarget() {
  switch (target) {
    case 'desktop':
    case 'ios':
    case 'android':
      return adapterStatic({
        fallback: 'index.html'
      });

    case 'web':
    default:
      return adapterVercel();
  }
}

export default {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapterForTarget(),

    paths:
      target === 'desktop' || target === 'ios' || target === 'android'
        ? { relative: true }
        : undefined,

    serviceWorker: {
      register: false
    }
  }
};