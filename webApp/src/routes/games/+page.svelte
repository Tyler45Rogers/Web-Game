<script>
  import { onMount } from 'svelte';

  let gameContainer;

  onMount(async () => {
    // 1. Dynamically import Phaser and your Scene ONLY in the browser environment
    const Phaser = (await import('phaser')).default;
    const PlanetTestScene = (await import('$lib/scripts/PlanetTestScene.js')).default;

    // 2. Initialize the game exactly as before
    const config = {
      type: Phaser.AUTO,
      width: 1000,
      height: 800,
      parent: gameContainer,
      backgroundColor: '#050510', // Deep space blue/black
      pixelArt: true,             // Keeps pixel art perfectly crisp!
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0.6 },
          debug: false // Great for tweaking your planet hitboxes!
        }
      },
      scene: [PlanetTestScene]
    };

    const game = new Phaser.Game(config);

    // Cleanup when leaving the page
    return () => {
      game.destroy(true);
    };
  });
</script>

<div bind:this={gameContainer}></div>