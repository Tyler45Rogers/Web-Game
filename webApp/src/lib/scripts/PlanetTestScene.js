import Phaser from 'phaser';

export default class PlanetTestScene extends Phaser.Scene {
  constructor() {
    super('PlanetTestScene');

    this.GAME_WIDTH = 900;
    this.GAME_HEIGHT = 900;
    
    this.canDrop = true;
    this.currentPreview = null;
    this.currentPreviewId = 0;
    this.nextPreviewId = 0;
    
    this.highestUnlockedId = 2;
    this.minSpawnId = 0;
    this.maxSpawnId = 2;

    this.isEduMode = false;

    this.isSettingsOpen = false;
  }

  init(data) {
    // If we passed an isEduMode flag, use it. Otherwise, default to false.
    this.isEduMode = (data && data.isEduMode !== undefined) ? data.isEduMode : false;
    this.isSettingsOpen = (data && data.keepSettingsOpen !== undefined) ? data.keepSettingsOpen : false;
    this.particlesEnabled = (data && data.particlesEnabled !== undefined) ? data.particlesEnabled : true;
    this.isDevMode = (data && data.isDevMode !== undefined) ? data.isDevMode : false;
    this.isGameOver = false;
    this.canDrop = true;
  }

  preload() {
    this.load.spritesheet('planets', '/planetsprite.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {

    // --- DYNAMIC CAMERA ZOOM ---
    const resizeCamera = () => {
      const screenW = this.scale.gameSize.width;
      const screenH = this.scale.gameSize.height;
      
      // Calculate how much we need to zoom to fit the 800x1000 game on screen
      const zoom = Math.min(screenW / this.GAME_WIDTH, screenH / this.GAME_HEIGHT);
      
      this.cameras.main.setZoom(zoom);
      this.cameras.main.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
    };

    // Run it once on boot, and listen for window resizing (like rotating a phone)
    this.scale.on('resize', resizeCamera);
    resizeCamera();

    // --- CENTRALIZED BUCKET CONFIGURATION ---
    this.bucket = {
      innerWidth: 500,  
      innerHeight: 600,  
      bottomOffset: 50, 
      wallThickness: 50 
    };

    // Calculate absolute coordinates based on our VIRTUAL this.GAME_WIDTH/this.GAME_HEIGHT
    this.bucket.centerX = this.GAME_WIDTH / 2;
    this.bucket.floorY = this.GAME_HEIGHT - this.bucket.bottomOffset;
    this.bucket.leftX = this.bucket.centerX - (this.bucket.innerWidth / 2);
    this.bucket.rightX = this.bucket.centerX + (this.bucket.innerWidth / 2);
    this.bucket.topY = this.bucket.floorY - this.bucket.innerHeight;

    // --- BACKGROUND GRADIENT & STARFIELD ---
    const bgGraphics = this.add.graphics();
    const topColor = 0x050510; 
    const bottomColor = 0x3b115e; 
    const splitY = this.GAME_HEIGHT * 0.66; 

    // OVERDRAW the backgrounds so they cover extreme ultrawide monitors and tall phones!
    bgGraphics.fillStyle(topColor, 1);
    bgGraphics.fillRect(-2000, -2000, this.GAME_WIDTH + 4000, splitY + 2000);

    bgGraphics.fillGradientStyle(topColor, topColor, bottomColor, bottomColor, 1, 1, 1, 1);
    bgGraphics.fillRect(-2000, splitY, this.GAME_WIDTH + 4000, this.GAME_HEIGHT + 2000);

    for (let i = 0; i < 300; i++) {
      // Spread the stars out further too!
      const x = Phaser.Math.Between(-1000, this.GAME_WIDTH + 1000);
      const y = Phaser.Math.Between(-1000, this.GAME_HEIGHT + 1000);
      const radius = Phaser.Math.FloatBetween(0.5, 2);
      const alpha = Phaser.Math.FloatBetween(0.2, y / this.GAME_HEIGHT + 0.2); 
      
      bgGraphics.fillStyle(0xffffff, alpha);
      bgGraphics.fillCircle(x, y, radius);
    }

    // --- 1. ENVIRONMENT ---
    const wallOptions = { isStatic: true, friction: 0.1 };
    const wt = this.bucket.wallThickness;
    
    // Floor
    this.matter.add.rectangle(
      this.bucket.centerX, 
      this.bucket.floorY + (wt / 2), 
      this.bucket.innerWidth + (wt * 2), // Extends slightly into the walls
      wt, 
      wallOptions
    ); 
    // Left Wall
    this.matter.add.rectangle(
      this.bucket.leftX - (wt / 2), 
      this.bucket.floorY - (this.bucket.innerHeight / 2), 
      wt, 
      this.bucket.innerHeight, // Make walls extra tall to catch high bounces
      wallOptions
    ); 
    // Right Wall
    this.matter.add.rectangle(
      this.bucket.rightX + (wt / 2), 
      this.bucket.floorY - (this.bucket.innerHeight / 2), 
      wt, 
      this.bucket.innerHeight, 
      wallOptions
    );

    // --- CONSTELLATION CONTAINER UI ---
    const graphics = this.add.graphics();
    
    // Define the 4 corners using our central config!
    const tl = { x: this.bucket.leftX, y: this.bucket.topY }; 
    const bl = { x: this.bucket.leftX, y: this.bucket.floorY };  
    const br = { x: this.bucket.rightX, y: this.bucket.floorY };  
    const tr = { x: this.bucket.rightX, y: this.bucket.topY }; 

    // 1. Draw the ethereal connecting lines
    graphics.lineStyle(2, 0xffffff, 0.4); 
    graphics.beginPath();
    graphics.moveTo(tl.x, tl.y);
    graphics.lineTo(bl.x, bl.y);
    graphics.lineTo(br.x, br.y);
    graphics.lineTo(tr.x, tr.y);
    graphics.lineTo(tl.x, tl.y);
    graphics.strokePath();

    // 2. Draw the major stars at the vertices
    const corners = [tl, bl, br, tr];
    
    corners.forEach(corner => {
      graphics.fillStyle(0x00ffff, 0.3);
      graphics.fillCircle(corner.x, corner.y, 14);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(corner.x, corner.y, 4);
      graphics.lineStyle(2, 0xffffff, 0.8);
      graphics.lineBetween(corner.x - 10, corner.y, corner.x + 10, corner.y); 
      graphics.lineBetween(corner.x, corner.y - 10, corner.x, corner.y + 10); 
    });

    // --- 2. GAME DATA ---
    this.celestialData = [
      { id: 0, name: 'Pluto', visualScale: 0.20, bodyRadius: 62, originY: 0.5 }, 
      { id: 1, name: 'Moon', visualScale: 0.30, bodyRadius: 62, originY: 0.5 }, 
      { id: 2, name: 'Mercury', visualScale: 0.40, bodyRadius: 62, originY: 0.5 }, 
      { id: 3, name: 'Mars', visualScale: 0.50, bodyRadius: 62, originY: 0.5 }, 
      { id: 4, name: 'Venus', visualScale: 0.60, bodyRadius: 62, originY: 0.5 }, 
      { id: 5, name: 'Earth', visualScale: 0.65, bodyRadius: 62, originY: 0.5 }, 
      { id: 6, name: 'Neptune', visualScale: 0.85, bodyRadius: 62, originY: 0.5 },
      { id: 7, name: 'Uranus', visualScale: 0.95, bodyRadius: 62, originY: 0.5 }, 
      { id: 8, name: 'Saturn', visualScale: 1.80, originY: 0.5, isCompound: true, coreRadius: 38, ringWidth: 120, ringHeight: 30, ringAngle: 0 },
      { id: 9, name: 'Jupiter', visualScale: 1.40, bodyRadius: 60, originY: 0.5 }, 
      { id: 10, name: 'Sun', visualScale: 2.0, originY: 0.5, isBumpy: true, coreRadius: 46, bumpCount: 4, bumpWidth: 110, bumpHeight: 20 },
      { id: 11, name: 'Black Hole', visualScale: 3, originY: 0.5, isCompound: true, coreRadius: 40, ringWidth: 120, ringHeight: 25, ringAngle: 0 }
    ];

    // --- 3. INPUT CONTROLS ---
    this.input.on('pointermove', this.handlePointerMove, this);
    this.input.on('pointerdown', this.handlePointerDown, this);
    this.input.on('pointerup', this.handlePointerUp, this);

    this.isUIInteraction = false;
    
    // --- 4. COLLISION LOGIC ---
    this.setupCollisions();

    // --- 5.4 PARTICLE SYSTEM ---
    const spark = this.add.graphics();
    spark.fillStyle(0xffffff, 1);
    spark.fillRect(0, 0, 8, 8);
    spark.generateTexture('spark', 8, 8);
    spark.destroy();

    // Phaser 3.60+ Syntax: Create the emitter directly!
    // this.add.particles(x, y, texture, config)
    this.dustEmitter = this.add.particles(0, 0, 'spark', {
      speed: { min: 200, max: 500 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 }, 
      alpha: { start: 1, end: 0 },   
      lifespan: 500,
      gravityY: 0,                 
      blendMode: 'ADD',              
      tint: [0xde7300, 0xde7300, 0xffffff], 
      emitting: false // NOTE: 'on: false' was changed to 'emitting: false' in v3.60
    });
    
    this.dustEmitter.setDepth(90);

    // --- 5.5 SCORE UI ---
    this.score = 0;
    
    // Check local storage for the saved high score, default to 0
    this.highScore = parseInt(localStorage.getItem('suikaHighScore')) || 0;

    this.scoreText = this.add.text(30, 30, 'SCORE: 0', {
      fontSize: '32px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ffff',
      shadow: { fill: true, blur: 10, color: '#00ffff', offsetY: 0, offsetX: 0 }
    }).setDepth(100);

    // Add the High Score text right beneath the current score
    this.highScoreText = this.add.text(30, 70, `BEST: ${this.highScore}`, {
      fontSize: '24px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#ff00ff', // A cool neon pink to contrast the cyan
      shadow: { fill: true, blur: 10, color: '#ff00ff', offsetY: 0, offsetX: 0 }
    }).setDepth(100);

    // --- 5.6 AIMING GUIDE ---
    this.aimLine = this.add.graphics();
    this.aimLine.setDepth(98); // Put it right behind the floating text, but above the background

    // --- 5.7 NEXT PLANET UI ---
    // Draw a faint box in the top right for the next planet
    const nextBoxX = this.GAME_WIDTH - 150;
    const nextBoxY = 20;
    
    const uiGraphics = this.add.graphics();
    uiGraphics.lineStyle(2, 0x00ffff, 0.4);
    uiGraphics.strokeRect(nextBoxX, nextBoxY, 120, 140);
    uiGraphics.fillStyle(0x000000, 0.5);
    uiGraphics.fillRect(nextBoxX, nextBoxY, 120, 140);

    this.add.text(nextBoxX + 60, nextBoxY + 15, 'NEXT', {
      fontSize: '20px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ffff'
    }).setOrigin(0.5).setDepth(100);

    // Create a persistent sprite inside the box
    this.nextPlanetUI = this.add.sprite(nextBoxX + 60, nextBoxY + 80, 'planets', 0);
    this.nextPlanetUI.setDepth(100);

    // Pre-roll the very first "next" planet so it's ready for spawnNextPreview()
    const spawnFloor = this.isDevMode ? 0 : this.minSpawnId;
    const spawnCeiling = this.isDevMode ? 11 : this.maxSpawnId;
    this.nextPreviewId = Phaser.Math.Between(spawnFloor, spawnCeiling);

    // --- 5.7.5 EVOLUTION LEGEND UI ---
    const legendX = this.GAME_WIDTH - 80; // Positioned safely to the right of the bucket
    let legendY = 190;           // Starts just below the NEXT box

    this.add.text(legendX - 10, legendY, 'EVOLUTION:', {
      fontSize: '20px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#aaaaaa',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100);

    legendY += 40;

    this.celestialData.forEach((planet, index) => {
      // Draw the sprite
      let legendSprite = this.add.sprite(legendX - 50, legendY + (index * 50), 'planets', planet.id);
      
      // We force all legend sprites to a consistent 32x32 size so massive planets 
      // like the Sun and Black Hole don't overlap the text or UI boundaries!
      legendSprite.setDisplaySize(32, 32); 
      legendSprite.setDepth(100);

      // Draw the name
      this.add.text(legendX - 25, legendY + (index * 50), planet.name.toUpperCase(), {
        fontSize: '18px',
        fontFamily: '"Courier New", Courier, monospace',
        color: '#ffffff'
      }).setOrigin(0, 0.5).setDepth(100);
    });

    // --- 5.8 START GAME ---
    this.spawnNextPreview();

    // --- 5.9 SETTINGS MENU ---
    // 1. The button on the main screen to open settings
    const settingsBtn = this.add.text(30, 110, '[ SETTINGS ]', {
      fontSize: '20px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#aaaaaa'
    }).setDepth(100).setInteractive({ useHandCursor: true });

    // 2. The Container that holds all settings UI
    this.settingsContainer = this.add.container(0, 0).setDepth(200);
    this.settingsContainer.setVisible(this.isSettingsOpen); // Hidden by default

    // 3. Dark Overlay (Expanded to 4000x4000 to cover zoomed-out screens!)
    const overlay = this.add.rectangle(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, 4000, 4000, 0x000000, 0.85);
    overlay.setInteractive(); 

    // 4. Settings Panel Background
    const panel = this.add.rectangle(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, 400, 360, 0x050510, 1);
    panel.setStrokeStyle(4, 0x00ffff);

    // 5. Menu Title
    const settingsTitle = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 - 130, 'SYSTEM SETTINGS', {
      fontSize: '32px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#ffffff',
      shadow: { fill: true, blur: 10, color: '#00ffff', offsetY: 0, offsetX: 0 }
    }).setOrigin(0.5);

    // 6. The EDU Toggle 
    this.eduToggle = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 - 60, this.isEduMode ? '[X] EDU MODE' : '[ ] EDU MODE', {
      fontSize: '24px',
      fontFamily: '"Courier New", Courier, monospace',
      color: this.isEduMode ? '#00ff00' : '#aaaaaa'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.eduToggle.on('pointerdown', () => {
      this.scene.restart({ 
        isEduMode: !this.isEduMode,        
        particlesEnabled: this.particlesEnabled, 
        isDevMode: this.isDevMode, 
        keepSettingsOpen: true 
      }); 
    });

    // 6.5 The PARTICLES Toggle
    this.particleToggle = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 - 10, this.particlesEnabled ? '[X] PARTICLES' : '[ ] PARTICLES', {
      fontSize: '24px',
      fontFamily: '"Courier New", Courier, monospace',
      color: this.particlesEnabled ? '#00ff00' : '#aaaaaa'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.particleToggle.on('pointerdown', () => {
      this.scene.restart({ 
        isEduMode: this.isEduMode,              
        particlesEnabled: !this.particlesEnabled, 
        isDevMode: this.isDevMode, 
        keepSettingsOpen: true 
      }); 
    });

    // 6.6 The DEV MODE Toggle
    this.devToggle = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + 40, this.isDevMode ? '[X] DEV MODE' : '[ ] DEV MODE', {
      fontSize: '24px',
      fontFamily: '"Courier New", Courier, monospace',
      color: this.isDevMode ? '#00ff00' : '#aaaaaa'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.devToggle.on('pointerdown', () => {
      this.scene.restart({ 
        isEduMode: this.isEduMode,              
        particlesEnabled: this.particlesEnabled, 
        isDevMode: !this.isDevMode, 
        keepSettingsOpen: true 
      }); 
    });

    // 7. Close Menu Button
    const closeBtn = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + 120, '> RESUME', {
      fontSize: '24px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ffff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      this.settingsContainer.setVisible(false);
      this.isSettingsOpen = false;
    });

    // 8. Add all pieces into the Container
    this.settingsContainer.add([overlay, panel, settingsTitle, this.eduToggle, this.particleToggle, this.devToggle, closeBtn]);

    // 9. Wire up the main screen button to open the menu
    settingsBtn.on('pointerdown', () => {
      if (!this.isGameOver) {
        this.settingsContainer.setVisible(true);
        this.isSettingsOpen = true;
      }
    });

    // --- 6. GAME OVER STATE ---
    this.isGameOver = false;
  }

  // ==========================================
  // GAME LOOP & INPUT
  // ==========================================

  spawnNextPreview() {
    if (this.isGameOver) return; 

    // 1. The player gets whatever was waiting in the "Next" box
    this.currentPreviewId = this.nextPreviewId;
    
    // 2. Roll a new planet to replace it in the "Next" box
    const spawnCeiling = this.isDevMode ? 11 : this.maxSpawnId;
    this.nextPreviewId = Phaser.Math.Between(this.minSpawnId, spawnCeiling);

    // 3. Update the UI sprite to show the new next planet
    const nextData = this.celestialData[this.nextPreviewId];
    this.nextPlanetUI.setFrame(this.nextPreviewId);
    this.nextPlanetUI.setOrigin(0.5, nextData.originY || 0.5);
    
    // Scale it down slightly so even larger preview planets fit in the UI box
    this.nextPlanetUI.setScale(nextData.visualScale * 0.8); 

    // 4. Setup the actual draggable preview for the player (Your existing code)
    const currentData = this.celestialData[this.currentPreviewId];
    this.currentPreview = this.add.sprite(this.GAME_WIDTH / 2, 185, 'planets', this.currentPreviewId);
    
    const originY = currentData.originY || 0.5;
    this.currentPreview.setOrigin(0.5, originY);
    this.currentPreview.setScale(currentData.visualScale);
    
    this.canDrop = true;
    
    this.handlePointerMove(this.input.activePointer);
  }

  handlePointerMove(pointer) {
    if (this.isSettingsOpen) return;

    if (!this.isGameOver && this.canDrop && this.currentPreview) {
      
      const data = this.celestialData[this.currentPreviewId];
      const visualRadius = 64 * data.visualScale; 

      // Pull exact boundaries from the config
      const clampedX = Phaser.Math.Clamp(
        pointer.worldX, 
        this.bucket.leftX + visualRadius - 5, 
        this.bucket.rightX - visualRadius + 5
      );
      
      this.currentPreview.x = clampedX;
    }
  }

  handlePointerDown(pointer, currentlyOver) {
    if (this.isSettingsOpen) return;

    // If the user taps a UI button (like Settings or Next), flag it and abort!
    if (currentlyOver && currentlyOver.length > 0) {
      this.isUIInteraction = true;
      return; 
    }

    this.isUIInteraction = false;

    // Immediately snap the preview planet to the finger's location 
    // by triggering the move logic manually on the first tap.
    this.handlePointerMove(pointer);
  }

  handlePointerUp(pointer) {
    if (this.isSettingsOpen) return;

    // If the touch started on a UI button, reset the flag and abort the drop
    if (this.isUIInteraction) {
      this.isUIInteraction = false;
      return;
    }

    if (!this.isGameOver && this.canDrop && this.currentPreview) {
      this.canDrop = false; // Prevent spam clicking

      const dropX = this.currentPreview.x;
      const dropY = this.currentPreview.y;
      const dropId = this.currentPreviewId;

      // Destroy the inert preview sprite
      this.currentPreview.destroy();
      this.currentPreview = null;

      // Spawn the actual physics object
      this.spawnPhysicsPlanet(dropX, dropY, dropId);

      // Wait 1 second before giving the player the next planet
      this.time.delayedCall(1000, () => {
        this.spawnNextPreview();
      });
    }
  }

  // ==========================================
  // PHYSICS SPAWNER
  // ==========================================

  spawnPhysicsPlanet(x, y, id) {
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const planetInfo = this.celestialData[id];
    
    let planet = this.matter.add.sprite(x, y, 'planets', id);
    planet.setScale(planetInfo.visualScale);

    if (planetInfo.isCompound) {
      const scaledCore = planetInfo.coreRadius * planetInfo.visualScale;
      const scaledWidth = planetInfo.ringWidth * planetInfo.visualScale;
      const scaledHeight = planetInfo.ringHeight * planetInfo.visualScale;
      
      const core = Bodies.circle(x, y, scaledCore); 
      const ring = Bodies.rectangle(x, y, scaledWidth, scaledHeight, {
        angle: Phaser.Math.DegToRad(planetInfo.ringAngle),
        chamfer: { radius: scaledHeight / 2 } 
      });
      
      const compoundBody = Body.create({ parts: [core, ring] });
      planet.setExistingBody(compoundBody);

    } else if (planetInfo.isBumpy) {
      const scaledCore = planetInfo.coreRadius * planetInfo.visualScale;
      const scaledWidth = planetInfo.bumpWidth * planetInfo.visualScale;
      const scaledHeight = planetInfo.bumpHeight * planetInfo.visualScale;

      const parts = [Bodies.circle(x, y, scaledCore)];
      const angleStep = Math.PI / planetInfo.bumpCount;

      for (let i = 0; i < planetInfo.bumpCount; i++) {
        const bump = Bodies.rectangle(x, y, scaledWidth, scaledHeight, {
          angle: i * angleStep,
          chamfer: { radius: scaledHeight / 2 } 
        });
        parts.push(bump); 
      }

      const bumpyBody = Body.create({ parts: parts });
      planet.setExistingBody(bumpyBody);

    } else {
      const scaledRadius = planetInfo.bodyRadius * planetInfo.visualScale;
      const circleBody = Bodies.circle(x, y, scaledRadius);
      planet.setExistingBody(circleBody);
    }
    
    const originY = planetInfo.originY || 0.5;
    planet.setOrigin(0.5, originY); 
    
    planet.setBounce(0.2); 
    planet.setFriction(0.0025); 
    planet.setFrictionAir(0.01); 

    // --- GAME LOGIC TAGS ---
    // We attach custom data to the physics body so we can identify it during collisions
    planet.body.isPlanet = true;
    planet.body.planetId = id;
    planet.body.isMerging = false; // Prevents a planet from merging twice in the same frame
    
    // Record exactly when this planet was dropped
    planet.setData('spawnTime', this.time.now);

    return planet;
  }

  // ==========================================
  // MERGE LOGIC
  // ==========================================

  setupCollisions() {
    this.matter.world.on('collisionstart', (event) => {
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        // Matter.js compound bodies trigger collisions on their individual *parts* (like a ring or a bump).
        // We must check `.parent` to get the root body where we stored our custom `planetId`.
        const bodyA = pairs[i].bodyA.parent || pairs[i].bodyA;
        const bodyB = pairs[i].bodyB.parent || pairs[i].bodyB;

        // Ensure both objects are planets
        if (bodyA.isPlanet && bodyB.isPlanet) {
          
          // Check if they are the same type of planet
          if (bodyA.planetId === bodyB.planetId) {
            
            // Check if they are already in the process of merging
            if (!bodyA.isMerging && !bodyB.isMerging) {
              
              // Lock them to prevent triple-merges
              bodyA.isMerging = true;
              bodyB.isMerging = true;

              const currentId = bodyA.planetId;
              const nextId = currentId + 1; 

              // We now allow nextId to reach 12 (combining two Black Holes)
              if (nextId <= 12) {
                const midX = (bodyA.position.x + bodyB.position.x) / 2;
                const midY = (bodyA.position.y + bodyB.position.y) / 2;
                
                // --- NEW MODE TOGGLE SCORING LOGIC ---
                let pointsEarned = 0;
                
                if (this.isEduMode) {
                  // Your custom educational point tier list
                  const eduScores = [1, 2, 3, 4, 7, 7, 30, 31, 74, 88, 864, 1111];
                  
                  if (currentId === 11) {
                    pointsEarned = 2222; // The ultimate 2x Black Hole payout
                  } else {
                    pointsEarned = eduScores[currentId];
                  }
                } else {
                  // Classic exponential arcade scoring
                  pointsEarned = Math.pow(2, nextId) * 10;
                }

                this.score += pointsEarned;
                this.scoreText.setText(`SCORE: ${this.score}`);
                
                if (this.score > this.highScore) {
                  this.highScore = this.score;
                  this.highScoreText.setText(`BEST: ${this.highScore}`);
                  localStorage.setItem('suikaHighScore', this.highScore);
                }
                
                this.spawnFloatingScore(midX, midY, pointsEarned);

                // --- THE JUICE: PARTICLES ---
                if (this.particlesEnabled) {
                  const particleCount = 2 + (nextId * 4); 
                  this.dustEmitter.explode(particleCount, midX, midY);
                }

                // Destroy the old colliding planets
                if (bodyA.gameObject) bodyA.gameObject.destroy();
                if (bodyB.gameObject) bodyB.gameObject.destroy();

                // --- PROGRESSION CHECK (Ignored for Black Holes) ---
                if (nextId > this.highestUnlockedId && nextId <= 11) {
                  this.highestUnlockedId = nextId;
                  this.maxSpawnId = Math.min(8, Math.max(2, this.highestUnlockedId - 4));
                  this.minSpawnId = Math.max(0, this.maxSpawnId - 5);
                }

                // --- SPAWN OR ANNIHILATE ---
                if (nextId <= 11) {
                  // Standard spawn for all standard planets
                  const newPlanet = this.spawnPhysicsPlanet(midX, midY, nextId);
                  
                  newPlanet.setTintFill(0x00ffff);
                  this.time.delayedCall(100, () => {
                    if (newPlanet && newPlanet.active) {
                      newPlanet.clearTint();
                    }
                  });
                } else {
                  // BLACK HOLE ANNIHILATION EVENT
                  this.cameras.main.shake(400, 0.025);
                  if (this.particlesEnabled) {
                    this.dustEmitter.explode(150, midX, midY);
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  update(time) {
    if (this.isGameOver) return;

    // --- DYNAMIC AIMING LINE ---
    this.aimLine.clear(); 

    if (this.canDrop && this.currentPreview) {
      const data = this.celestialData[this.currentPreviewId];
      const visualRadius = 64 * data.visualScale;
      const startY = this.currentPreview.y + visualRadius;
      
      this.aimLine.lineStyle(2, 0xffffff, 0.15); 
      // Use this.bucket.floorY to always snap the laser to the bottom
      this.aimLine.lineBetween(this.currentPreview.x, startY, this.currentPreview.x, this.bucket.floorY);
    }
    
    // Grab all planets currently in the physics simulation
    const planets = this.children.list.filter(c => c.body && c.body.isPlanet);

    planets.forEach(planet => {
      const timeAlive = time - planet.getData('spawnTime');
      
      if (timeAlive > 2000) {
        const bounds = planet.getBounds();
        
        // Use our central config to check if they are completely out of bounds
        const completelyOutLeft = bounds.right < this.bucket.leftX;
        const completelyOutRight = bounds.left > this.bucket.rightX;
        const completelyOutBottom = bounds.top > this.bucket.floorY;
        const completelyOutTop = bounds.bottom < this.bucket.topY;

        if (completelyOutLeft || completelyOutRight || completelyOutBottom || completelyOutTop) {
          this.triggerGameOver();
        }
      }
    });
  }

  triggerGameOver() {
    this.isGameOver = true;
    this.canDrop = false;

    this.matter.world.pause();

    this.aimLine.clear();
    if (this.currentPreview) {
      this.currentPreview.destroy();
      this.currentPreview = null;
    }
    
    if (this.nextPlanetUI) {
      this.nextPlanetUI.setVisible(false);
    }

    // Darken the screen with a massive overlay (4000x4000)
    const overlay = this.add.rectangle(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, 4000, 4000, 0x000212, 0.85);
    overlay.setDepth(100);

    // Terminal Style Game Over Text
    this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 - 50, 'CONTAINMENT BREACH', {
      fontSize: '48px',
      fontFamily: '"Courier New", Courier, monospace',
      fontStyle: 'bold',
      color: '#ff3333',
      shadow: { fill: true, blur: 15, color: '#ff0000', offsetY: 0, offsetX: 0 }
    }).setOrigin(0.5).setDepth(101);

    // Sci-Fi Restart Button
    const restartBtn = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + 50, '> INITIALIZE RESTART', {
      fontSize: '24px',
      fontFamily: '"Courier New", Courier, monospace',
      color: '#00ffff',
      shadow: { fill: true, blur: 10, color: '#00ffff', offsetY: 0, offsetX: 0 }
    }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true });

    // Interactive Neon Hover
    restartBtn.on('pointerover', () => {
      restartBtn.setColor('#ffffff');
      restartBtn.setShadow(0, 0, '#ffffff', 15, true, true);
    });
    restartBtn.on('pointerout', () => {
      restartBtn.setColor('#00ffff');
      restartBtn.setShadow(0, 0, '#00ffff', 10, true, true);
    });
    restartBtn.on('pointerup', () => {
      this.scene.restart({
        isEduMode: this.isEduMode,
        particlesEnabled: this.particlesEnabled,
        isDevMode: this.isDevMode, // --- NEW ---
        keepSettingsOpen: false 
      }); 
    });
  }

  spawnFloatingScore(x, y, points) {
    const floatText = this.add.text(x, y, `+${points}`, {
      fontSize: '28px',
      fontFamily: '"Courier New", Courier, monospace',
      fontStyle: 'bold',
      color: '#ffffff',
      shadow: { fill: true, blur: 5, color: '#ff00ff', offsetY: 0, offsetX: 0 }
    }).setOrigin(0.5).setDepth(99);

    // Animate the text floating up and fading out over 1 second
    this.tweens.add({
      targets: floatText,
      y: y - 60,       // Move 60 pixels up
      alpha: 0,        // Fade to transparent
      duration: 1000,  // 1000 ms (1 second)
      ease: 'Power2',  // Smooth deceleration
      onComplete: () => {
        floatText.destroy(); // Clean up memory when done
      }
    });
  }
}