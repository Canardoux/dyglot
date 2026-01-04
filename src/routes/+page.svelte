<script lang="ts">
  import CardSimple from '$lib/ui/CardSimple.svelte';
  import type { LearningCard } from '$lib/core/card';

  const demoCard: LearningCard = {
    id: 'demo-001',
    koreanText: '음악을 좋아해요.',
    englishText: 'I like music.',
    targetWordId: 'word-umak',
    details: {
      hanja: '音樂',
      japanese: '音楽（おんがく）',
      grammarNote: '-을/를 marks the object.',
      examples: [
        '저는 음악을 들어요.',
        '음악을 많이 들어요.'
      ]
    }
  };
</script>

<div class="min-h-dvh flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <CardSimple card={demoCard} />
  </div>
</div>