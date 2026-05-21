import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.image('logo', '/assets/planets.png');
  }

  create() {
    this.add.image(500, 500, 'logo');
  }
}

export function createGame(parent) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
    parent: parent, // attaches to DOM element
    scene: [MainScene]
  });
}