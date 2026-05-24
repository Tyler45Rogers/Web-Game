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
  0: 0.36,   // pluto
  1: 0.432,  // moon
  2: 0.5184, // mercury
  3: 0.6336, // mars
  4: 0.7776, // venus
  5: 0.972,  // earth
  6: 1.224,  // neptune
  7: 1.476,  // uranus
  8: 1.8,    // saturn
  9: 2.16,   // jupiter
  10: 2.52,  // sun
  11: 2.88   // black_hole
};

let largestPlanet = 1;
//Array containing the current planet to be made and the next planet
let planetQueue = [];
//Text for next planet
let nextText = "Next Planet:\n";
//Array of all planet sprites
let planetsArray = [];
//Boolean of whether a planet is falling
let isPlanetFalling = true;

//Clamp x coordiinates for the planets to 144 and 744
const clamp = (val) => Math.min(Math.max(val, 160), 840);

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  preload() {
    //Background
    this.load.image('background', '/assets/space.jpg');
    this.load.image('border', '/assets/border.png');
    this.load.spritesheet('planets', '/assets/planetsprite.png', { frameWidth: 128, frameHeight: 128 });
    
  }

  //function to create a planet after collision
  makePlanet(planet, scale, x = 512, y = 0) {
    const sprite = this.matter.add
      .sprite(x, y, 'planets', planet)
      .setCircle(64)
      .setScale(scale, scale);

    sprite.isPlanet = true;
    sprite.isFalling = false;

    //Set largest planet
    if(largestPlanet < planet){
      largestPlanet = planet;
    }
    return sprite; 
  }

  //Creates planets when user clicks
  newPlanet(x = 512, y = 112) {
    x = clamp(x);
    const sprite = this.matter.add
      .sprite(x, y, 'planets', planetQueue[0])
      .setCircle(64)
      .setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);

    sprite.isPlanet = true;
    sprite.isFalling = true;

    //Set largest planet
    if(largestPlanet < planetQueue[0]){
      largestPlanet = planetQueue[0];
    }

    //Update nextSprite
    this.nextSprite.setTexture('planets', planetQueue[1]);
    //Update planet queue
    planetQueue[0] = planetQueue[1];
    planetQueue[1] = this.nextPlanet();
    //set new currentPlanet sprite
    this.currentSprite.setFrame(planetQueue[0]).setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);
    return sprite; 
  }

  

  //Get random num 0-11
  random12(max){
      return Math.floor(Math.random() * (max - 0 + 1)) + 0;
  }

  //Uses the knowledge of what the largest planets are to get next planets
  nextPlanet(){
      return this.random12(largestPlanet - 1);
  }
  
  //Takes two planet sprites, if they are the same a bigger one replaces them
  collidePlanets(planetA, planetB){  
        if (planetA.frame.name !== planetB.frame.name) return;

        let xA = planetA.x;
        let yA = planetA.y;
        let xB = planetB.x;
        let yB = planetB.y;

        let x = (xA + xB) / 2;
        let y = (yA + yB) / 2;

        //Get sprite of new planet
        let newPlanet =  parseInt(planetA.frame.name) + 1;
        //Remove old planets
        planetA.destroy();
        planetB.destroy();
        
        planetsArray.push(this.makePlanet(newPlanet, planets_scale[newPlanet], x, y));
  }
  
  //Updates
  update(){
    this.trajectoryLine.x = clamp(this.input.activePointer.x);
    this.currentSprite.x = clamp(this.input.activePointer.x);

    //Check whether a planet is falling
    for (let planet of planetsArray){
      if (! planet.body) continue;
      else{
        let speed = Math.abs(planet.body.velocity.y);
        if (speed > 0.2) isPlanetFalling = false;
        else isPlanetFalling = true;
      }
    }

    //If a planet is falling, trajectory line is not visible
    if(!isPlanetFalling){
      this.trajectoryLine.setAlpha(0);
    }
    else{
      this.trajectoryLine.setAlpha(1);
    }
  }


  create() {
    //Background
    this.add.image(500, 500, 'background');
    //Initialize queue
    planetQueue[0] = this.nextPlanet();
    planetQueue[1] = this.nextPlanet();
    //Show current planet at pointer position
    this.currentSprite = this.add.sprite(500, 112, 'planets', planetQueue[0]).setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);
    //print next planet
    this.nextPlanetText = this.add.text(10, 10, nextText, { fontSize: '24px', fill: '#fff' });
    //Sprite for next planet
    this.nextSprite = this.add.sprite((this.nextPlanetText.width / 2) + 10, this.nextPlanetText.height + 32, 'planets', planetQueue[1]).setScale(0.5);
    //Line following mouse to show trajectory
    this.trajectoryLine = this.add.sprite(0, 112, 'border').setScale(0.015, 6);
    this.trajectoryLine.setOrigin(0.0, 0)




    //First planet is made here, need to show what it is
    //spawn planet at mouse x coordinate
    this.input.on('pointerup', function (pointer) {
        // Spawns the planet using the mouse's X coordinate and a fixed Y coordinate
        planetsArray.push(this.newPlanet(pointer.x));
    }, this);


    //Check if two of the same planets collide, if so combine them into the next biggest planet
    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      //If same planet, remove them and add new planet in their location
      event.pairs.forEach(pair => {

        const planetA = pair.bodyA.gameObject;
        const planetB = pair.bodyB.gameObject;

        //Make sure they exist
        if (!planetA || !planetB) return;

        //Check they are planets
        if (!planetA.isPlanet || !planetB.isPlanet) return;

        //Call collide function
        this.collidePlanets(planetA, planetB);

      })

    })

    //Bounds of the world (whole element)
    this.matter.world.setBounds(0, 0, width, height, 10, true, true, true);
    //Gravity
    this.matter.world.setGravity(0, 1, 0.0025);

    //Ground and walls
    //Graphics object
    let graphics = this.add.graphics();
    graphics.fillStyle(0x808080);
    //Bottom rectangle (will be bottom for game)
    this.bottomRect = this.add.rectangle(500, this.scale.height - 128, this.scale.width - 256, 32, 0x808080);


    this.leftRect = this.add.rectangle(128 + 16, 484, 32, this.scale.height - 256, 0x808080);
    this.rightRect = this.add.rectangle(this.scale.width - 128 - 16, 484, 32, this.scale.height - 256, 0x808080);
    this.matter.add.gameObject(this.leftRect, {static: true});
    this.matter.add.gameObject(this.rightRect, {static: true});
    this.matter.add.gameObject(this.bottomRect, {static: true});

    this.leftRect.setStatic(true);
    this.rightRect.setStatic(true);
    this.bottomRect.setStatic(true);
  
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