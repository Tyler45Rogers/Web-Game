import Phaser from 'phaser';

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
let planetQueue = [];
let nextText = "Next Planet:\n";
let planetsArray = [];
let isPlanetFalling = true;

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  clamp(val) {
    return Math.min(Math.max(val, this.clampMin), this.clampMax);
  }

  preload() {
    this.load.image('background', '/assets/space.jpg');
    this.load.image('border', '/assets/border.png');
    this.load.spritesheet('planets', '/assets/planetsprite.png', { frameWidth: 128, frameHeight: 128 });
  }

  makePlanet(planet, scale, x, y) {
    const sf = this.sf;
    if (x === undefined) x = 512 * sf;
    if (y === undefined) y = 0;
    let sprite;

    if (planet == 8) {
      sprite = this.matter.add
        .sprite(x, y, 'planets', planet)
        .setScale(scale, scale);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      const innerCircle = Bodies.circle(0, 0, 70,   { label: 'saturn-body' });
      const leftRing    = Bodies.circle(-90, 0, 30,  { label: 'saturn-ring' });
      const rightRing   = Bodies.circle( 90, 0, 30,  { label: 'saturn-ring' });

      const compoundBody = Body.create({ parts: [innerCircle, leftRing, rightRing] });
      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    else if (planet == 11) {
      sprite = this.matter.add
        .sprite(x, y, 'planets', planet)
        .setScale(scale, scale);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      const innerCircle = Bodies.circle(0, 0, 128,   { label: 'blackhole-body' });
      const leftRing    = Bodies.circle(-160, 0, 30, { label: 'blackhole-ring' });
      const rightRing   = Bodies.circle( 160, 0, 30, { label: 'blackhole-ring' });

      const compoundBody = Body.create({ parts: [innerCircle, leftRing, rightRing] });
      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    else {
      sprite = this.matter.add
        .sprite(x, y, 'planets', planet)
        .setCircle(64)
        .setScale(planets_scale[planet] * sf, planets_scale[planet] * sf);
    }

    sprite.isPlanet = true;
    sprite.isFalling = true;

    if (largestPlanet < planet) {
      largestPlanet = planet;
    }
    return sprite;
  }

  newPlanet(x, y) {
    const sf = this.sf;
    if (y === undefined) y = this.topY - 50 * sf;
    if (x === undefined) x = this.scale.width / 2;
    let sprite;
    x = this.clamp(x);

    if (planetQueue[0] == 8) {
      sprite = this.matter.add
        .sprite(x, y, 'planets', planetQueue[0])
        .setScale(planets_scale[planetQueue[0]] * sf, planets_scale[planetQueue[0]] * sf);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      const innerCircle = Bodies.circle(0, 0, 70,   { label: 'saturn-body' });
      const leftRing    = Bodies.circle(-90, 0, 30,  { label: 'saturn-ring' });
      const rightRing   = Bodies.circle( 90, 0, 30,  { label: 'saturn-ring' });

      const compoundBody = Body.create({ parts: [innerCircle, leftRing, rightRing] });
      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    else if (planetQueue[0] == 11) {
      sprite = this.matter.add
        .sprite(x, y, 'planets', planetQueue[0])
        .setScale(planets_scale[planetQueue[0]] * sf, planets_scale[planetQueue[0]] * sf);

      const Bodies = Phaser.Physics.Matter.Matter.Bodies;
      const Body = Phaser.Physics.Matter.Matter.Body;

      const innerCircle = Bodies.circle(0, 0, 128,   { label: 'blackhole-body' });
      const leftRing    = Bodies.circle(-160, 0, 30, { label: 'blackhole-ring' });
      const rightRing   = Bodies.circle( 160, 0, 30, { label: 'blackhole-ring' });

      const compoundBody = Body.create({ parts: [innerCircle, leftRing, rightRing] });
      sprite.setExistingBody(compoundBody);
      sprite.setPosition(x, y);
    }
    else {
      sprite = this.matter.add
        .sprite(x, y, 'planets', planetQueue[0])
        .setCircle(64)
        .setScale(planets_scale[planetQueue[0]] * sf, planets_scale[planetQueue[0]] * sf);
    }

    sprite.isPlanet = true;
    sprite.isFalling = true;

    if (largestPlanet < planetQueue[0]) {
      largestPlanet = planetQueue[0];
    }

    planetQueue[0] = planetQueue[1];
    planetQueue[1] = this.nextPlanet();
    this.nextSprite.setTexture('planets', planetQueue[1]);
    this.currentSprite
      .setFrame(planetQueue[0])
      .setScale(planets_scale[planetQueue[0]] * sf, planets_scale[planetQueue[0]] * sf);
    return sprite;
  }

  random12(max) {
    return Math.floor(Math.random() * (max - 0 + 1)) + 0;
  }

  nextPlanet() {
    if (largestPlanet < 5) {
      return Math.min(this.random12(largestPlanet - 2), 3);
    }
    return Math.min(this.random12(largestPlanet - 2), 7);
  }

  collidePlanets(planetA, planetB) {
    if (!planetA.active || !planetB.active) return;
    if (planetA.frame.name !== planetB.frame.name) return;

    const newPlanetIndex = parseInt(planetA.frame.name) + 1;
    const x = (planetA.x + planetB.x) / 2;
    const y = (planetA.y + planetB.y) / 2;

    planetA.destroy();
    planetB.destroy();

    // Defer by one frame so destroyed bodies are fully cleaned up
    if (planetA.frame.name != 11) {
      this.time.delayedCall(0, () => {
        planetsArray.push(
          this.makePlanet(newPlanetIndex, planets_scale[newPlanetIndex] * this.sf, x, y)
        );
      });
    }
  }

  update() {
    if (this.isGameOver) return;

    this.trajectoryLine.x = this.clamp(this.input.activePointer.x);
    this.currentSprite.x  = this.clamp(this.input.activePointer.x);

    for (let planet of planetsArray) {
      if (!planet.body) continue;
      let speed = Math.abs(planet.body.velocity.y);
      if (speed > 0.5) isPlanetFalling = false;
      else isPlanetFalling = true;
    }

    if (!isPlanetFalling) {
      this.trajectoryLine.setAlpha(0);
    } else {
      this.trajectoryLine.setAlpha(1);
    }

    let anyPlanetOverLine = false;
    for (let planet of planetsArray) {
      if (!planet.body) continue;

      const vx = planet.body.velocity.x;
      const vy = planet.body.velocity.y;
      const isSettled = Math.sqrt(vx * vx + vy * vy) < 0.3;

      if (planet.y < this.topY + planets_minYValue[planet.frame.name] * this.sf
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

    const W = this.scale.width;
    const H = this.scale.height;
    const sf = this.sf;

    this.matter.world.setGravity(0, 0);
    planetsArray.forEach(p => {
      if (p.body) this.matter.body.setStatic(p.body, true);
    });

    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7);

    this.add.text(W / 2, H / 2 - 80 * sf, 'GAME OVER', {
      fontSize: `${Math.round(64 * sf)}px`,
      fill: '#ff4444',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const btnBg = this.add.rectangle(W / 2, H / 2 + 40 * sf, 220 * sf, 60 * sf, 0xffffff);
    btnBg.setInteractive({ useHandCursor: true });

    this.add.text(W / 2, H / 2 + 40 * sf, 'Restart', {
      fontSize: `${Math.round(32 * sf)}px`,
      fill: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    btnBg.on('pointerover', () => btnBg.setFillStyle(0xdddddd));
    btnBg.on('pointerout',  () => btnBg.setFillStyle(0xffffff));

    btnBg.on('pointerup', () => {
      largestPlanet = 1;
      planetQueue   = [];
      planetsArray  = [];
      isPlanetFalling = true;
      this.overLineTimer = null;
      this.scene.restart();
    });
  }

  create() {
    // Grab scaleFactor set by createGame
    this.sf = this.registry.get('scaleFactor') ?? 1;
    const sf = this.sf;

    this.overLineTimer = null;
    this.isGameOver    = false;

    const W      = this.scale.width;
    const H      = this.scale.height;
    const margin = 128 * sf;
    const thick  = 12  * sf;

    this.topY = H * 0.15;
    const innerTop    = this.topY;
    const innerBottom = H - margin - thick / 2;
    const innerHeight = innerBottom - innerTop;
    const innerCenterY = innerTop + innerHeight / 2;
    const borderColor  = 0xffffff;

    this.clampMin = margin + thick;
    this.clampMax = W - margin - thick;

    // Background
    this.add.image(W / 2, H / 2, 'background').setDisplaySize(W, H);

    // Planet icons along the bottom
    const totalPlanets   = 12;
    const bottomY        = H - margin / 2;
    const availableWidth = W - margin * 2;
    const spacing        = availableWidth / totalPlanets;
    const iconScale      = Math.min(spacing / 128, 0.6 * sf);

    for (let i = 0; i < totalPlanets; i++) {
      const x = margin + spacing * i + spacing / 2;
      this.add.sprite(x, bottomY, 'planets', i).setScale(iconScale);
    }

    // Planet queue
    planetQueue[0] = this.nextPlanet();
    planetQueue[1] = this.nextPlanet();

    // Current planet sprite (follows pointer)
    this.currentSprite = this.add
      .sprite(W / 2, this.topY - 50 * sf, 'planets', planetQueue[0])
      .setScale(planets_scale[planetQueue[0]] * sf, planets_scale[planetQueue[0]] * sf);

    // "Next planet" UI
    const uiScale  = sf * 0.85;
    const fontSize = Math.round(24 * uiScale);
    this.nextPlanetText = this.add.text(10, 10, nextText, {
      fontSize: `${fontSize}px`,
      fill: '#fff'
    });

    const nextSpriteScale = 0.5 * uiScale;
    this.nextSprite = this.add.sprite(
      this.nextPlanetText.width / 2 + 10,
      this.nextPlanetText.height + Math.round(32 * uiScale),
      'planets',
      planetQueue[1]
    ).setScale(nextSpriteScale);

    // Trajectory line
    this.trajectoryLine = this.add
      .sprite(0, this.topY - 50 * sf, 'border')
      .setScale(0.015 * sf, (H * 0.85) / 100);   // height scales with game height
    this.trajectoryLine.setOrigin(0.0, 0);

    // Spawn on click/tap
    this.input.on('pointerup', function (pointer) {
      if (this.isGameOver)   return;
      if (!isPlanetFalling)  return;
      planetsArray.push(this.newPlanet(pointer.x));
    }, this);

    // Collision handling
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        const getGO = (body) =>
          body.gameObject ?? body.parent?.gameObject ?? null;

        const planetA = getGO(pair.bodyA);
        const planetB = getGO(pair.bodyB);
        if (!planetA || !planetB) return;

        if (planetA?.isPlanet && planetA.isFalling &&
            planetA.y > this.topY + planets_minYValue[planetA.frame.name] * sf) {
          planetA.isFalling = false;
        }
        if (planetB?.isPlanet && planetB.isFalling &&
            planetB.y > this.topY + planets_minYValue[planetB.frame.name] * sf) {
          planetB.isFalling = false;
        }

        if (planetA === planetB) return;
        if (!planetA.isPlanet || !planetB.isPlanet) return;
        this.collidePlanets(planetA, planetB);
      });
    });

    this.matter.world.setBounds(0, 0, W, H, 10, true, true, true);
    this.matter.world.setGravity(0, 1, 0.001);

    // Borders
    this.topRect = this.add.rectangle(W / 2, this.topY, W - margin * 2, 2, borderColor);

    this.bottomRect = this.add.rectangle(
      W / 2, H - margin - thick / 2,
      W - margin * 2, thick,
      borderColor
    );
    this.matter.add.gameObject(this.bottomRect, { isStatic: true });

    this.leftRect = this.add.rectangle(
      margin + thick / 2, innerCenterY,
      thick, innerHeight,
      borderColor
    );
    this.matter.add.gameObject(this.leftRect, { isStatic: true });

    this.rightRect = this.add.rectangle(
      W - margin - thick / 2, innerCenterY,
      thick, innerHeight,
      borderColor
    );
    this.matter.add.gameObject(this.rightRect, { isStatic: true });
  }
}

export function createGame(parent, size = 800) {
  const scaleFactor = size / 800;

  const config = {
    type: Phaser.AUTO,
    width: size,
    height: size,
    parent,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'matter',
      matter: {
        debug: false,
        positionIterations: 10,
        velocityIterations: 10,
        getDelta: () => 1000 / 60, // always simulate at 60fps regardless of actual framerate
      }
    },
    scene: [MainScene],
    callbacks: {
      preBoot: (game) => {
        game.registry.set('scaleFactor', scaleFactor);
      }
    }
  };

  return new Phaser.Game(config);
}