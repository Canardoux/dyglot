import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { fileURLToPath, URL } from 'node:url';

const target = process.env.BUILD_TARGET;
const isDesktop = target === 'desktop';
const isIOS = target === 'ios';
const isFileTarget = isDesktop || isIOS;

export default defineConfig({
  	base: isFileTarget ? './' : '/',
	resolve: {
			alias: {
				$pwa: fileURLToPath(
					new URL(
						target === 'desktop'
						? './src/lib/pwa/pwa-info.desktop.ts'
						: './src/lib/pwa/pwa-info.ts',
						import.meta.url
					)
		)

			}
	},

	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' }),

		!isDesktop && SvelteKitPWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'favicon.png',
				'apple-touch-icon.png',
				'pwa-192x192.png',
				'pwa-512x512.png'
			],
			manifest: {
				name: 'Dyglot',
				short_name: 'Dyglot',
				description: 'Learn Korean with phrase-first flashcards',
				start_url: '.',
				scope: '.',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#ffffff',
				icons: [
				{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
				]
			},
			workbox: {
				runtimeCaching: [
				{
				urlPattern: ({ request }) => request.destination === 'audio',
				handler: 'CacheFirst',
				options: {
				cacheName: 'dyglot-audio',
				expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }
				}
				}
				]
			}
		})

	].filter(Boolean),

	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});