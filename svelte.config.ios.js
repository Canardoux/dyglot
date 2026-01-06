import adapter from '@sveltejs/adapter-static';
import config from './svelte.config.js';

// This config is only for Capacitor (iOS build).
export default {
  ...config,
  kit: {
    ...config.kit,
    adapter: adapter({
      fallback: 'index.html' // SPA fallback so routes work inside the app
    })
  }
};