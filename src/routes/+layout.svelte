<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

  // In runes mode, avoid `$:`. pwaInfo is static, so a plain const is enough.
  const webManifest = pwaInfo?.webManifest?.linkTag ?? '';

	onMount(async () => {
	// SvelteKit SSR: register via dynamic import
	if (pwaInfo) {
	const { registerSW } = await import('virtual:pwa-register');
	registerSW({
		immediate: true,
		onRegistered(r) {
		console.log('SW registered', r);
		},
		onRegisterError(error) {
		console.error('SW registration error', error);
		}
	});
	}
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} />{@html webManifest}</svelte:head>

{@render children()}
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
