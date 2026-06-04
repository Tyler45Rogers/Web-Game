import Phaser from 'phaser';

const width = 800;
const height = 800;

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
  0: 0.25,   // pluto
  1: 0.35,   // moon
  2: 0.45,   // mercury
  3: 0.55,   // mars
  4: 0.65,   // venus
  5: 0.70,   // earth
  6: 0.90,   // neptune
  7: 1.00,   // uranus
  8: 2.00,   // saturn
  9: 1.45,   // jupiter
  10: 2.10,  // sun
  11: 3.00   // black_hole
};

const planets_minYValue = {
  0: 64 * 0.25,   // pluto   - radius ~16
  1: 64 * 0.35,   // moon    - radius ~22
  2: 64 * 0.45,   // mercury - radius ~29
  3: 64 * 0.55,   // mars    - radius ~35
  4: 64 * 0.65,   // venus   - radius ~42
  5: 64 * 0.70,   // earth   - radius ~45
  6: 64 * 0.90,   // neptune - radius ~58
  7: 64 * 1.00,   // uranus  - radius ~64
  8: 64 * 2.00,   // saturn  - radius ~128
  9: 64 * 1.45,   // jupiter - radius ~93
  10: 64 * 2.10,  // sun     - radius ~134
  11: 64 * 3.00   // black_hole - radius ~192
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

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  //Clamp x coordiinates for the planets to borders
  clamp(val) {
    return Math.min(Math.max(val, this.clampMin), this.clampMax);
  }

  preload() {
    //Background
    this.load.image('background', '/assets/space.jpg');
    this.load.image('border', '/assets/border.png');
    this.load.spritesheet('planets', '/assets/planetsprite.png', { frameWidth: 128, frameHeight: 128 });
    
  }

  //function to create a planet after collision
  makePlanet(planet, scale, x = 512, y = 0) {
    let sprite;

    //Check saturn
    if(planet == 8){
      sprite = this.matter.add
        .sprite(x, y, 'planets', planet)
        .setScale(scale, scale);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      // Inner planet body (tighter circle, centered)
      const innerCircle = Bodies.circle(0, 0, 70, { label: 'saturn-body' });

      // Left and right ring segments (offset from center)
      const leftRing  = Bodies.circle(-90, -0, 30, { label: 'saturn-ring' });
      const rightRing = Bodies.circle( 90, 0, 30, { label: 'saturn-ring' });

      const compoundBody = Body.create({
        parts: [innerCircle, leftRing, rightRing]
      });

      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    //Check black hole
    else if(planet == 11){
      sprite = this.matter.add
        .sprite(x, y, 'planets', planet)
        .setScale(scale, scale);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      // Inner planet body (tighter circle, centered)
      const innerCircle = Bodies.circle(0, 0, 128, { label: 'saturn-body' });

      // Left and right ring segments (offset from center)
      const leftRing  = Bodies.circle(-160, 0, 30, { label: 'saturn-ring' });
      const rightRing = Bodies.circle( 160, 0, 30, { label: 'saturn-ring' });

      const compoundBody = Body.create({
        parts: [innerCircle, leftRing, rightRing]
      });

      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    //other planets
    else{
      sprite = this.matter.add
        .sprite(x, y, 'planets', planet)
        .setCircle(64)
        .setScale(scale, scale);
    }

    sprite.isPlanet = true;
    sprite.isFalling = true;

    //Set largest planet
    if(largestPlanet < planet){
      largestPlanet = planet;
    }
    return sprite; 
  }

  //Creates planets when user clicks
  newPlanet(x = 512, y) {
      if (y === undefined) y = this.topY - 50;
    let sprite;
    x = this.clamp(x);
    //Check for saturn
    if(planetQueue[0] == 8){
      sprite = this.matter.add
        .sprite(x, y, 'planets', planetQueue[0])
        .setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      // Inner planet body (tighter circle, centered)
      const innerCircle = Bodies.circle(0, 0, 70, { label: 'saturn-body' });

      // Left and right ring segments (offset from center)
      const leftRing  = Bodies.circle(-90, -0, 30, { label: 'saturn-ring' });
      const rightRing = Bodies.circle( 90, 0, 30, { label: 'saturn-ring' });

      const compoundBody = Body.create({
        parts: [innerCircle, leftRing, rightRing]
      });

      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    //Check for black hole
    else if(planetQueue[0] == 11){
      sprite = this.matter.add
        .sprite(x, y, 'planets', planetQueue[0])
        .setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      // Inner planet body (tighter circle, centered)
      const innerCircle = Bodies.circle(0, 0, 128, { label: 'saturn-body' });

      // Left and right ring segments (offset from center)
      const leftRing  = Bodies.circle(-160, 0, 30, { label: 'saturn-ring' });
      const rightRing = Bodies.circle( 160, 0, 30, { label: 'saturn-ring' });

      const compoundBody = Body.create({
        parts: [innerCircle, leftRing, rightRing]
      });

      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    //Other planets
    else{
      sprite = this.matter.add
        .sprite(x, y, 'planets', planetQueue[0])
        .setCircle(64)
        .setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);
    }

    sprite.isPlanet = true;
    sprite.isFalling = true;

    //Set largest planet
    if(largestPlanet < planetQueue[0]){
      largestPlanet = planetQueue[0];
    }

    //Update planet queue
    planetQueue[0] = planetQueue[1];
    planetQueue[1] = this.nextPlanet();
    //Update nextSprite
    this.nextSprite.setTexture('planets', planetQueue[1]);
    //set new currentPlanet sprite
    this.currentSprite.setFrame(planetQueue[0]).setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);
    return sprite; 
  }

  

  //Get random num 0-11
  random12(max){
      return Math.floor(Math.random() * (max - 0 + 1)) + 0;
  }

  //Uses the knowledge of what the largest planets are to get next planets
  //Cannot go over 7
  //If largest planet is 3, next planet can only be 0, 1, 2, or 3
  //When largest planet is 7, next planet can be any planet from 0-7
  nextPlanet(){
      if (largestPlanet < 5) {
        return Math.min(this.random12(largestPlanet - 2), 3);
      }

      return Math.min(this.random12(largestPlanet - 2), 7);
  }
  
  //Takes two planet sprites, if they are the same a bigger one replaces them
  collidePlanets(planetA, planetB){
        //Check that the planets arent already destroyed
        if (!planetA.active || !planetB.active) return;

        if (planetA.frame.name !== planetB.frame.name) return;

        //Only make new planet if not black holes
        if (planetA.frame.name != 11){
          let xA = planetA.x;
          let yA = planetA.y;
          let xB = planetB.x;
          let yB = planetB.y;

          let x = (xA + xB) / 2;
          let y = (yA + yB) / 2;

          //Get sprite of new planet
          let newPlanet =  parseInt(planetA.frame.name) + 1; 
          planetsArray.push(this.makePlanet(newPlanet, planets_scale[newPlanet], x, y));
        }
        //Remove old planets
        planetA.destroy();
        planetB.destroy();
        
  }
  
  //Updates
  update(){
    if (this.isGameOver) return;
    
    this.trajectoryLine.x = this.clamp(this.input.activePointer.x);
    this.currentSprite.x = this.clamp(this.input.activePointer.x);

    //Check whether a planet is falling
    for (let planet of planetsArray){
      if (! planet.body) continue;
      else{
        let speed = Math.abs(planet.body.velocity.y);
        if (speed > 0.5) isPlanetFalling = false;
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

    //Loss check
    let anyPlanetOverLine = false;
    for (let planet of planetsArray) {
      if (!planet.body) continue;
      
      const vx = planet.body.velocity.x;
      const vy = planet.body.velocity.y;
      const isSettled = Math.sqrt(vx * vx + vy * vy) < 0.3;
      
      if (planet.y < this.topY + planets_minYValue[planet.frame.name] 
          && !planet.isFalling 
          && isSettled) {
        anyPlanetOverLine = true;
        break;
      }
    }

    if (anyPlanetOverLine) {
      if (!this.overLineTimer) {
        this.overLineTimer = this.time.now;
      } else if (this.time.now - this.overLineTimer > 3000) {
        this.triggerGameOver();
      }
    } else {
      this.overLineTimer = null;
    }
  }

  triggerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    // Freeze all physics
    this.matter.world.setGravity(0, 0);
    planetsArray.forEach(p => {
      if (p.body) this.matter.body.setStatic(p.body, true);
    });

    // Dark overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Game Over text
    this.add.text(width / 2, height / 2 - 80, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff4444',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Restart button background
    const btnBg = this.add.rectangle(width / 2, height / 2 + 40, 220, 60, 0xffffff);
    btnBg.setInteractive({ useHandCursor: true });

    // Restart button text
    const btnText = this.add.text(width / 2, height / 2 + 40, 'Restart', {
      fontSize: '32px',
      fill: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Hover effect
    btnBg.on('pointerover', () => btnBg.setFillStyle(0xdddddd));
    btnBg.on('pointerout',  () => btnBg.setFillStyle(0xffffff));

    // Restart on click — reset globals and restart scene
    btnBg.on('pointerup', () => {
      largestPlanet = 1;
      planetQueue = [];
      planetsArray = [];
      isPlanetFalling = true;
      this.overLineTimer = null;
      this.scene.restart();
    });
  }

  create() {
    //Game over vars
    this.overLineTimer = null;
    this.isGameOver = false;
    //Border Variables
    //Variables for borders
    const W = this.scale.width;
    const H = this.scale.height;
    const margin = 128;
    const thick = 12;

    this.topY = H * 0.15; // 15% from the top, adjust the fraction as needed
    const innerTop = this.topY;
    const innerBottom = H - margin - thick / 2;
    const innerHeight = innerBottom - innerTop;
    const innerCenterY = innerTop + innerHeight / 2;
    const borderColor = 0xffffff;
    this.clampMin = margin + thick;           // left wall inner edge
    this.clampMax = W - margin - thick;       // right wall inner edge

    //Background
    this.add.image(500, 500, 'background');
    // Display planets below the box, centered and scaled to window width
    const totalPlanets = 12;
    const bottomY = H - margin / 2;           // centered in the margin below the box
    const availableWidth = W - margin * 2;    // same width as the play area
    const spacing = availableWidth / totalPlanets;
    const iconScale = Math.min(spacing / 128, 0.6); // scale icons to fit, max 0.6

    for (let i = 0; i < totalPlanets; i++) {
      const x = margin + spacing * i + spacing / 2; // evenly spaced, centered in each slot
      this.add.sprite(x, bottomY, 'planets', i).setScale(iconScale);
    }
    //Initialize queue
    planetQueue[0] = this.nextPlanet();
    planetQueue[1] = this.nextPlanet();
    //Show current planet at pointer position
    this.currentSprite = this.add.sprite(500, this.topY - 50, 'planets', planetQueue[0]).setScale(planets_scale[planetQueue[0]], planets_scale[planetQueue[0]]);
    //print next planet
    const uiScale = (W / 800) * 0.85; // scale with window, 15% smaller
    const fontSize = Math.round(24 * uiScale);
    this.nextPlanetText = this.add.text(10, 10, nextText, { fontSize: `${fontSize}px`, fill: '#fff' });
    const nextSpriteScale = 0.5 * uiScale;
    this.nextSprite = this.add.sprite(
      (this.nextPlanetText.width / 2) + 10,
      this.nextPlanetText.height + Math.round(32 * uiScale),
      'planets',
      planetQueue[1]
    ).setScale(nextSpriteScale);
    //Line following mouse to show trajectory
    this.trajectoryLine = this.add.sprite(0, this.topY  - 50, 'border').setScale(0.015, 4.6);
    this.trajectoryLine.setOrigin(0.0, 0)

    //First planet is made here, need to show what it is
    //spawn planet at mouse x coordinate
    this.input.on('pointerup', function (pointer) {
        if (this.isGameOver) return;
        //Cannot spawn if a planet is falling
        if (!isPlanetFalling) return;
        // Spawns the planet using the mouse's X coordinate and a fixed Y coordinate
        planetsArray.push(this.newPlanet(pointer.x));
    }, this);


    //Check if two of the same planets collide, if so combine them into the next biggest planet
    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      //If same planet, remove them and add new planet in their location
      event.pairs.forEach(pair => {
        const getGameObject = (body) => {
          if (body.gameObject) return body.gameObject;
          if (body.parent && body.parent.gameObject) return body.parent.gameObject;
          return null;
        };

        const planetA = getGameObject(pair.bodyA);
        const planetB = getGameObject(pair.bodyB);
        //Make sure they exist
        if (!planetA || !planetB) return;
        //Check that it isnt a planet colliding with itself

        // ── NEW: mark falling planets as landed on any collision ──
        if (planetA && planetA.isPlanet && planetA.isFalling) {
          if (planetA.y > this.topY + planets_minYValue[planetA.frame.name]) {
            planetA.isFalling = false;
          }
        }
        if (planetB && planetB.isPlanet && planetB.isFalling) {
          if (planetB.y > this.topY + planets_minYValue[planetB.frame.name]) {
            planetB.isFalling = false;
          }
        }

        if(planetA === planetB) return;
        //Check they are planets
        if (!planetA.isPlanet || !planetB.isPlanet) return;
        //Call collide function
        this.collidePlanets(planetA, planetB);
      })
    });

    //Bounds of the world (whole element)
    this.matter.world.setBounds(0, 0, width, height, 10, true, true, true);
    //Gravity
    this.matter.world.setGravity(0, 1, 0.001);
    //Graphics object
    let graphics = this.add.graphics();
    graphics.fillStyle(0x808080);

    //Creating Borders - Scale with screen size

    // Top border (thin line)
    this.topRect = this.add.rectangle(
        W / 2, this.topY,
        W - margin * 2, 2,
        borderColor
    );

    // Bottom border
    this.bottomRect = this.add.rectangle(
        W / 2, H - margin - thick / 2,
        W - margin * 2, thick,
        borderColor
    );
    this.matter.add.gameObject(this.bottomRect, { isStatic: true });

    // Left border
    this.leftRect = this.add.rectangle(
        margin + thick / 2, innerCenterY,
        thick, innerHeight,
        borderColor
    );
    this.matter.add.gameObject(this.leftRect, { isStatic: true });

    // Right border
    this.rightRect = this.add.rectangle(
        W - margin - thick / 2, innerCenterY,
        thick, innerHeight,
        borderColor
    );
    this.matter.add.gameObject(this.rightRect, { isStatic: true });

  }//Create Close
}//Class close


export function createGame(parent) {
  const config = {
    type: Phaser.AUTO,
    width,
    height,
    parent,
    pixelArt: true,
    physics: {
      default: 'matter',
      matter: {
        debug: false
      }
    },
    scene: [MainScene]
  };

  return new Phaser.Game(config);
}