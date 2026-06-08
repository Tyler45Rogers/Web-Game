<script>
  import { onMount, onDestroy } from 'svelte';
  import { createGame } from '$lib/games/planets.js';

  let gameContainer;
  let game;

  function getSize() {
    const min = 300;
    const max = 800;
    const size = window.screen.width - 32; // screen.width never changes on zoom
    return Math.max(min, Math.min(size, max));
  }

  onMount(() => {
    const size = getSize();
    game = createGame(gameContainer, size);
  });

  onDestroy(() => {
    if (game) game.destroy(true);
  });
</script>

<section class="flex flex-col items-center w-full h-full">
  <p class="text-5xl font-bold mt-20">Games</p>
  <p class="text-3xl font-bold mt-10 mb-6">Planets</p>
  <div bind:this={gameContainer}></div>
</section>