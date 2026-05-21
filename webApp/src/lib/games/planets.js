import Phaser from 'phaser';

const width = 1000;
const height = 1000;

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.image('border', '/assets/border.png');
    this.load.spritesheet('planets', '/assets/planetsprite.png', { frameWidth: 128, frameHeight: 128 });
    
  }

  create() {

    //Bounds of the world (whole element)
    this.matter.world.setBounds(0, 0, width, height, 10, true, true, true);
    //Gravity
    this.matter.world.setGravity(0, 1, 0.0001);

    this.planet0 = this.matter.add.sprite(0, 0, 'planets', 0);
    this.planet0.setCircle(64);
    this.planet1 = this.matter.add.sprite(128, 0, 'planets', 1);
    this.planet1.setCircle(64);
    this.planet2 = this.matter.add.sprite(256, 0, 'planets', 2);
    this.planet2.setCircle(64);
    this.planet3 = this.matter.add.sprite(384, 0, 'planets', 3);
    this.planet3.setCircle(64);
    this.planet4 = this.matter.add.sprite(512, 0, 'planets', 4);
    this.planet4.setCircle(64);
    this.planet5 = this.matter.add.sprite(640, 0, 'planets', 5);
    this.planet5.setCircle(64);
    this.planet6 = this.matter.add.sprite(768, 0, 'planets', 6);
    this.planet6.setCircle(64);

    this.planet7 = this.matter.add.sprite(0, 128, 'planets', 7);
    this.planet7.setCircle(64);
    this.planet8 = this.matter.add.sprite(128, 128, 'planets', 8);
    this.planet8.setCircle(64);
    this.planet9 = this.matter.add.sprite(256, 128, 'planets', 9);
    this.planet9.setCircle(64);
    this.planet10 = this.matter.add.sprite(384, 128, 'planets', 10);
    this.planet10.setCircle(64);


    //Ground and walls
    //Graphics object
    let graphics = this.add.graphics();
    graphics.fillStyle(0x808080);
    //Bottom rectangle (will be bottom for game)
    this.bottomRect = this.add.rectangle(500, this.scale.height - 32, this.scale.width, 64, 0x808080);
    this.matter.add.gameObject(this.bottomRect, {static: true});

    
    

  }
}

export function createGame(parent) {
  const config = {
    type: Phaser.AUTO,
    width,
    height,
    parent,
    physics: {
      default: 'matter',
      matter: {
        debug: true
      }
    },
    scene: [MainScene]
  };

  return new Phaser.Game(config);
}