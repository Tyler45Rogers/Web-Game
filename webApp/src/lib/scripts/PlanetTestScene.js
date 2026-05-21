import Phaser from 'phaser';

export default class PlanetTestScene extends Phaser.Scene {
  constructor() {
    super('PlanetTestScene');
  }

  preload() {
    this.load.spritesheet('planets', '/planetsprite.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Create the container (Bucket) using Matter Rectangles
    // isStatic: true ensures these objects are immovable walls
    const wallOptions = { isStatic: true, friction: 0.1 };
    
    // x, y (center points), width, height
    this.matter.add.rectangle(width / 2, height - 25, 600, 50, wallOptions); // Floor
    this.matter.add.rectangle(width / 2 - 325, height - 350, 50, 600, wallOptions); // Left Wall
    this.matter.add.rectangle(width / 2 + 325, height - 350, 50, 600, wallOptions); // Right Wall

    // Visible boundary lines
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRect(width / 2 - 300, height - 650, 600, 600);

    const maxsize = 160; // Max planet radius

    // The "Single Source of Truth" for game balancing
    const celestialData = [
      // Standard Planets
      { id: 0, visualScale: 0.25, bodyRadius: 62, originY: 0.5 }, //pluto
      { id: 1, visualScale: 0.35, bodyRadius: 62, originY: 0.5 }, //moon
      { id: 2, visualScale: 0.45, bodyRadius: 62, originY: 0.5 }, //mercury
      { id: 3, visualScale: 0.55, bodyRadius: 62, originY: 0.5 }, //mars
      { id: 4, visualScale: 0.65, bodyRadius: 62, originY: 0.5 }, //venus
      { id: 5, visualScale: 0.70, bodyRadius: 62, originY: 0.5 }, //earth
      { id: 6, visualScale: 0.90, bodyRadius: 62, originY: 0.5 }, //neptune
      { id: 7, visualScale: 1.00, bodyRadius: 62  , originY: 0.5 }, //uranus
      
      // Saturn (Compound Body)
      { 
        id: 8, 
        visualScale: 2, 
        originY: 0.5, 
        isCompound: true, 
        coreRadius: 38,      // The center circle
        ringWidth: 120,      // Wide enough to stick out past the 128 core
        ringHeight: 30, 
        ringAngle: 0 
      },
      
      { id: 9, visualScale: 1.45, bodyRadius: 60, originY: 0.5 }, //jupiter

      {
        id: 10, 
        visualScale: 2.10, 
        originY: 0.5, 
        isBumpy: true,
        coreRadius: 46,
        bumpCount: 4,
        bumpWidth: 110,
        bumpHeight: 20
      }, //sun
      
      // Black Hole (Compound Body)
      { 
        id: 11, 
        visualScale: 3, 
        originY: 0.5, 
        isCompound: true, 
        coreRadius: 40, 
        ringWidth: 120, 
        ringHeight: 25, 
        ringAngle: 0 
      }
    ];

    this.dropPlanets(celestialData);
  }

  dropPlanets(data) {
    const width = this.scale.width;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    data.forEach((planetInfo, index) => {
      this.time.delayedCall(index * 600, () => {
        const dropX = Phaser.Math.Between(width / 2 - 150, width / 2 + 150);
        const dropY = 50;
        
        let planet = this.matter.add.sprite(dropX, dropY, 'planets', planetInfo.id);

        // 1. Apply visual scale first
        planet.setScale(planetInfo.visualScale);

        // 2. Build the perfectly sized physics bodies
        if (planetInfo.isCompound) {
          // ... Existing Saturn / Black Hole Ring Logic ...
          const scaledCore = planetInfo.coreRadius * planetInfo.visualScale;
          const scaledWidth = planetInfo.ringWidth * planetInfo.visualScale;
          const scaledHeight = planetInfo.ringHeight * planetInfo.visualScale;
          
          const core = Bodies.circle(dropX, dropY, scaledCore); 
          const ring = Bodies.rectangle(dropX, dropY, scaledWidth, scaledHeight, {
            angle: Phaser.Math.DegToRad(planetInfo.ringAngle),
            chamfer: { radius: scaledHeight / 2 } 
          });
          
          const compoundBody = Body.create({ parts: [core, ring] });
          planet.setExistingBody(compoundBody);

        } else if (planetInfo.isBumpy) {
          
          // --- NEW BUMPY LOGIC FOR THE SUN ---
          const scaledCore = planetInfo.coreRadius * planetInfo.visualScale;
          const scaledWidth = planetInfo.bumpWidth * planetInfo.visualScale;
          const scaledHeight = planetInfo.bumpHeight * planetInfo.visualScale;

          // Start the parts array with just the center core
          const parts = [Bodies.circle(dropX, dropY, scaledCore)];

          // Math.PI represents a half-circle (180 degrees). 
          // Dividing this by our bump count gives us the exact rotation spacing.
          const angleStep = Math.PI / planetInfo.bumpCount;

          for (let i = 0; i < planetInfo.bumpCount; i++) {
            const bump = Bodies.rectangle(dropX, dropY, scaledWidth, scaledHeight, {
              angle: i * angleStep,
              chamfer: { radius: scaledHeight / 2 } // Keep the bumps smooth!
            });
            parts.push(bump); // Add each rectangle to the parts array
          }

          // Fuse the core and all rectangles together
          const bumpyBody = Body.create({ parts: parts });
          planet.setExistingBody(bumpyBody);

        } else {
          // ... Existing Standard Planet Logic ...
          const scaledRadius = planetInfo.bodyRadius * planetInfo.visualScale;
          const circleBody = Bodies.circle(dropX, dropY, scaledRadius);
          planet.setExistingBody(circleBody);
        }
        
        // 3. APPLY ORIGIN AFTER THE BODY IS SET
        const originY = planetInfo.originY || 0.5;
        planet.setOrigin(0.5, originY); 
        
        // 4. Suika Physics Properties
        planet.setBounce(0.1); 
        planet.setFriction(0.005); 
        planet.setFrictionAir(0.01); 
        
      });
    });
  }
}