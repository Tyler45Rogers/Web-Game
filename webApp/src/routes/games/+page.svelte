<script>
  import { onMount } from 'svelte';

  let gameContainer;

  onMount(async () => {
    const Phaser = (await import('phaser')).default;
    const PlanetTestScene = (await import('$lib/scripts/PlanetTestScene.js')).default;

    const config = {
      type: Phaser.AUTO,
      pixelArt: true,
      backgroundColor: '#050510',

      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH
      },

      physics: {
        default: 'matter',
        matter: {
          enableSleeping: true,
          gravity: { y: 0.6 },
          debug: false 
        }
      },
      scene: [PlanetTestScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  });
</script>

<div id="game-container" bind:this={gameContainer}></div>

<style>
  :global(body), :global(html) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; 
    background-color: #050510; 
  }

  /* The Absolute Pinning Strategy */
  #game-container {
    position: absolute; 
    top: 85px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
  }
</style>