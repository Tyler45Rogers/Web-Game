import Phaser from 'phaser';

const width = 1000;
const height = 1000;

//Planets setup
const planets = {
  0: "pluto",
  1: "moon",
  2: "mercury",
  3: "mars",
  4: "venus",
  5: "earth",
  6: "neptune",
  7: "uranus",
  8: "saturn",
  9: "jupiter",
  10: "sun",
  11: "black_hole"
};

const planets_scale = {
  0: 0.45,  // pluto
  1: 0.54,  // moon
  2: 0.648, // mercury
  3: 0.792, // mars
  4: 0.972, // venus
  5: 1.215, // earth
  6: 1.53,  // neptune
  7: 1.845, // uranus
  8: 2.25,  // saturn
  9: 2.7,   // jupiter
  10: 3.15, // sun
  11: 3.6   // black_hole
};

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    this.load.image('border', '/assets/border.png');
    this.load.spritesheet('planets', '/assets/planetsprite.png', { frameWidth: 128, frameHeight: 128 });
    
  }

  //function to create a planet
  newPlanet(planet, scale) {
    return this.matter.add.sprite(512, 0, 'planets', planet).setCircle(64).setScale(scale, scale);
  }

  //Get random num 0-11
  random12(){
      return Math.floor(Math.random() * (11 - 0 + 1)) + 0;
  }
  
  create() {
    //Timer, planets will be added periodically00
    const planetTimer = this.time.addEvent(
      {
        delay: 1000,
        loop: true,
        callback: () => {
          let planet = this.random12();
          this.newPlanet(planet, planets_scale[planet]);}
      }
    );

    //Bounds of the world (whole element)
    this.matter.world.setBounds(0, 0, width, height, 10, true, true, true);
    //Gravity
    this.matter.world.setGravity(0, 1, 0.0001);

    /* for (let i = 0; i < 12; i++){
      this.newPlanet(i, planets_scale[i]);
    } */

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