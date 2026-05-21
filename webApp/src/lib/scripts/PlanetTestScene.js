import Phaser from 'phaser';

export default class PlanetTestScene extends Phaser.Scene {
  constructor() {
    super('PlanetTestScene');
  }

  preload() {
    // Load the 128x128 spritesheet
    this.load.spritesheet('planets', '/planetsprite.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Create the container (Bucket)
    // We use a static group for the walls and floor so they don't move when hit
    const walls = this.physics.add.staticGroup();

    // Invisible physics boundaries (x, y)
    const floor = walls.create(width / 2, height - 50, null).setSize(600, 100).setVisible(false);
    const leftWall = walls.create(width / 2 - 300, height - 350, null).setSize(50, 600).setVisible(false);
    const rightWall = walls.create(width / 2 + 300, height - 350, null).setSize(50, 600).setVisible(false);

    // Draw visible lines so we can see the bucket
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRect(width / 2 - 275, height - 650, 550, 600);

    // 2. Define the adjusted radii for the 128x128 boundaries
    const celestialData = [
      { id: 0, radius: 16 },  // Pluto
      { id: 1, radius: 20 },  // Moon
      { id: 2, radius: 24 },  // Mercury
      { id: 3, radius: 28 },  // Mars
      { id: 4, radius: 32 },  // Venus
      { id: 5, radius: 36 },  // Earth
      { id: 6, radius: 40 },  // Neptune
      { id: 7, radius: 44 },  // Uranus
      { id: 8, radius: 48 },  // Saturn
      { id: 9, radius: 54 },  // Jupiter
      { id: 10, radius: 60 }, // Sun
      { id: 11, radius: 64 }  // Black Hole
    ];

    // 3. Create a physics group for the dropping planets
    this.planetsGroup = this.physics.add.group();

    // Enable collisions
    this.physics.add.collider(this.planetsGroup, walls);
    this.physics.add.collider(this.planetsGroup, this.planetsGroup);

    // 4. Trigger the drop sequence
    this.dropPlanets(celestialData);
  }

  dropPlanets(data) {
    const width = this.scale.width;

    data.forEach((planetInfo, index) => {
      // Delay each drop by 600ms so they cascade nicely instead of overlapping
      this.time.delayedCall(index * 5000, () => {
        
        // Randomize the drop X coordinate slightly to ensure they bounce around
        const dropX = Phaser.Math.Between(width / 2 - 15, width / 2 + 15);
        
        // Spawn the planet at the top of the screen
        let planet = this.planetsGroup.create(dropX, 50, 'planets', planetInfo.id);
        
        // Apply circular physics
        planet.body.setCircle(planetInfo.radius);
        
        // Perfectly center the collision circle inside the 128x128 frame
        const offset = (128 - (planetInfo.radius * 2)) / 2;
        planet.body.setOffset(offset, offset);

        // Apply drop-game physics properties
        planet.setBounce(0.5); // Slight bounciness
        planet.setAngularDrag(150); // Slows down rotation over time
        planet.setDrag(150);         // Slows down horizontal sliding
        planet.setCollideWorldBounds(true);
        
        // Add a slight spin as they drop
        planet.setAngularVelocity(Phaser.Math.Between(-50, 50));
      });
    });
  }
}