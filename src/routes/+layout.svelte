<script lang="ts">
  import { page } from '$app/state';
  import { locales, localizeHref } from '$lib/paraglide/runtime';
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';

  import { getPwaInfo, registerPwa } from '$pwa';

  let pwaInfo: any = null;

  onMount(async () => {
    pwaInfo = await getPwaInfo();
    if (pwaInfo) {
      await registerPwa();
    }
  });

  let { children } = $props();

</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{@render children()}
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
