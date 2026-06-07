<script>
  import { onMount, onDestroy } from 'svelte';
  import { createGame } from '$lib/games/planets.js';

  let gameContainer;
  let game;

  onMount(() => {
    game = createGame(gameContainer);
  });

  onDestroy(() => {
    if (game) game.destroy(true);
  });
</script>

<section class="flex flex-col items-center w-full h-full mb-10">
  <p class="text-5xl font-bold mt-20">Games</p>
  <p class="text-3xl font-bold mt-10 mb-6">Planets</p>

  <!-- Wrapper handles the scaling -->
  <div class="scale-[0.6] lg:scale-100 origin-top mb-[-320px] lg:mb-0">
    <div bind:this={gameContainer}></div>
  </div>
</section>