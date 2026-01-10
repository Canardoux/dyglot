<script lang="ts">
  import type { LearningCard } from '$lib/core/card';
  import { browser } from '$app/environment';
  import { onDestroy } from 'svelte';
  export let card: LearningCard;

  let revealed = false;
  let showDetails = false;

  function revealAnswer() {
    revealed = true;
  }

  function markCorrect() {
    // later: emit event
    console.log('correct', card.id);
  }

  function markFailed() {
    // later: emit event
    console.log('failed', card.id);
  }

  function openDetails() {
    showDetails = true;
  }

  function closeDetails() {
    showDetails = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeDetails();
  }

$: if (browser) {
  if (showDetails) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

onDestroy(() => {
  if (browser) {
    document.body.style.overflow = '';
  }
});
</script>

<div class="min-h-[70dvh] w-full rounded-2xl border p-4 flex flex-col">
  <!-- Main content -->
  <!-- Main content -->
<div class="flex-1 flex flex-col items-center justify-center gap-4">
<div class="korean-text text-center text-4xl leading-tight font-medium">
  {card.koreanText}
</div>
<div class="english-text text-center min-h-[3.5rem]">
  {#if revealed}
    {card.englishText}
  {/if}
</div></div>
  <!-- Actions -->
 <!-- Actions -->
<div class="sticky bottom-0 pt-4 bg-white">
  {#if !revealed}
    <button
      class="w-full rounded-xl border py-3 text-lg"
      on:click={revealAnswer}
    >
      Show answer
    </button>
  {:else}
    <div class="flex items-center gap-3">
      <button
        class="flex-1 rounded-xl border py-3 text-xl"
        on:click={markFailed}
        aria-label="Mark as failed"
      >
        ❌
      </button>

      <button
        class="flex-1 rounded-xl border py-3 text-xl"
        on:click={markCorrect}
        aria-label="Mark as correct"
      >
        ✅
      </button>

      <button
        class="rounded-xl border px-4 py-3"
        on:click={openDetails}
      >
        Details(!!!)
      </button>
    </div>
  {/if}
</div>
 {#if showDetails && card.details}
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50"
    role="dialog"
    aria-modal="true"
    aria-label="Card details"
    tabindex="0"
    on:keydown={onKeyDown}
  >
    <!-- Backdrop -->
    <button
      class="absolute inset-0 w-full h-full bg-black/40"
      aria-label="Close details"
      on:click={closeDetails}
    ></button>

    <!-- Bottom sheet -->
    <div class="absolute inset-x-0 bottom-0">
      <div class="mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-xl border">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="font-semibold">Details</div>
          <button
            class="rounded-lg px-3 py-1 border"
            on:click={closeDetails}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div class="p-4 space-y-3 max-h-[60dvh] overflow-auto">
          {#if card.details.hanja}
            <div><strong>Hanja:</strong> {card.details.hanja}</div>
          {/if}
          {#if card.details.japanese}
            <div><strong>Japanese:</strong> {card.details.japanese}</div>
          {/if}
          {#if card.details.grammarNote}
            <div><strong>Grammar:</strong> {card.details.grammarNote}</div>
          {/if}
          {#if card.details.examples?.length}
            <div>
              <div class="font-semibold mb-1">Examples</div>
              <ul class="list-disc pl-5 space-y-1">
                {#each card.details.examples as ex}
                  <li>{ex}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <!-- Safe-area padding for iPhone home indicator -->
        <div class="h-[env(safe-area-inset-bottom)]"></div>
      </div>
    </div>
  </div>
{/if}
</div>