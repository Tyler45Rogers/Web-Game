<script>

  import { onMount, onDestroy } from 'svelte';
  import { createGame } from '$lib/games/planets.js';

  let gameContainer;
  let game;

  onMount(() => {
    game = createGame(gameContainer);
  });

  onDestroy(() => {
    if (game) {
      game.destroy(true);
    }
  });


</script>

<section class="flex flex-col justify-items-center mx-auto w-full h-full">

    <div class="flex flex-row justify-items-center mx-auto">
        <p class="text-5xl font-bold mt-20 mb-20"> Games </p>
    </div>


    <div class="flex flex-col justify-items-center mx-auto mb-20">
        <p class="text-3xl font-bold mb-10">Planets</p>

        <div bind:this={gameContainer}></div>
    </div>
    

</section>