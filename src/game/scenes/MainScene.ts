import Phaser from 'phaser';
import type { GameCallbacks } from '@/game/config';
import { getDirectionFromVelocity, type DirectionName } from '@/game/scenes/Preloader';

interface SpriteManifestEntry {
  id: string;
  name: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;
}

export class MainScene extends Phaser.Scene {
  // Player
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerSpeed = 200;
  private playerHP = 100;
  private maxHP = 100;
  private isInvincible = false;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private joystickVector = { x: 0, y: 0 };

  // Groups
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private xpGems!: Phaser.Physics.Arcade.Group;

  // Game state
  private score = 0;
  private fireTimer!: Phaser.Time.TimerEvent;
  private spawnTimer!: Phaser.Time.TimerEvent;
  private gameOver = false;

  // Callbacks
  private callbacks!: GameCallbacks;

  // Sprite data
  private manifest: SpriteManifestEntry[] = [];
  private playerSpriteName = 'pikachu';
  private enemySpriteNames: string[] = [];
  private currentDirection: DirectionName = 'down';
  private usePlaceholderGraphics = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    // Get callbacks from registry
    this.callbacks = this.registry.get('callbacks') as GameCallbacks;

    // Get sprite manifest from registry (set by Preloader)
    this.manifest = this.registry.get('spriteManifest') as SpriteManifestEntry[] || [];

    // Setup sprite names from manifest
    if (this.manifest.length > 0) {
      const names = this.manifest.map((s) => s.name);
      // Use pikachu as player if available, otherwise first sprite
      this.playerSpriteName = names.includes('pikachu') ? 'pikachu' : names[0];
      // Other sprites are enemies
      this.enemySpriteNames = names.filter((n) => n !== this.playerSpriteName);
      this.usePlaceholderGraphics = false;
    } else {
      this.usePlaceholderGraphics = true;
    }

    // Generate placeholder textures (used as fallback or for projectiles/gems)
    this.createTextures();

    // Create player
    this.createPlayer();

    // Create groups
    this.createGroups();

    // Setup input
    this.setupInput();

    // Setup collisions
    this.setupCollisions();

    // Start timers
    this.startTimers();

    // Initial callback updates
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onHPUpdate(this.playerHP);
  }

  private createTextures(): void {
    // Player: Blue circle (32px)
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x4a9eff, 1);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Enemy: Red square (24px)
    const enemyGraphics = this.make.graphics({ x: 0, y: 0 });
    enemyGraphics.fillStyle(0xff4a4a, 1);
    enemyGraphics.fillRect(0, 0, 24, 24);
    enemyGraphics.generateTexture('enemy', 24, 24);
    enemyGraphics.destroy();

    // Projectile: White circle (8px)
    const projectileGraphics = this.make.graphics({ x: 0, y: 0 });
    projectileGraphics.fillStyle(0xffffff, 1);
    projectileGraphics.fillCircle(4, 4, 4);
    projectileGraphics.generateTexture('projectile', 8, 8);
    projectileGraphics.destroy();

    // XP Gem: Yellow diamond (12px)
    const gemGraphics = this.make.graphics({ x: 0, y: 0 });
    gemGraphics.fillStyle(0xffd700, 1);
    gemGraphics.fillPoints([
      { x: 6, y: 0 },
      { x: 12, y: 6 },
      { x: 6, y: 12 },
      { x: 0, y: 6 },
    ], true);
    gemGraphics.generateTexture('xpGem', 12, 12);
    gemGraphics.destroy();
  }

  private createPlayer(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    if (this.usePlaceholderGraphics) {
      this.player = this.physics.add.sprite(centerX, centerY, 'player');
    } else {
      this.player = this.physics.add.sprite(centerX, centerY, this.playerSpriteName);
      this.player.play(`${this.playerSpriteName}-walk-down`);
      // Scale sprite to reasonable size (PMD sprites are small)
      this.player.setScale(2);
    }
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
  }

  private createGroups(): void {
    // Enemies group with pooling
    this.enemies = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 200,
      runChildUpdate: false,
    });

    // Projectiles group with pooling
    this.projectiles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 50,
      runChildUpdate: false,
    });

    // XP gems group with pooling
    this.xpGems = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 100,
      runChildUpdate: false,
    });
  }

  private setupInput(): void {
    // Keyboard input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }
  }

  private setupCollisions(): void {
    // Projectile hits enemy
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.handleProjectileEnemyCollision,
      undefined,
      this
    );

    // Player collects XP gem
    this.physics.add.overlap(
      this.player,
      this.xpGems,
      this.handleXPCollection,
      undefined,
      this
    );

    // Enemy touches player
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
  }

  private startTimers(): void {
    // Auto-fire every 1 second
    this.fireTimer = this.time.addEvent({
      delay: 1000,
      callback: this.fireProjectile,
      callbackScope: this,
      loop: true,
    });

    // Spawn enemies every 500ms
    this.spawnTimer = this.time.addEvent({
      delay: 500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  private fireProjectile(): void {
    if (this.gameOver) return;

    // Find nearest enemy
    const nearestEnemy = this.findNearestEnemy();
    if (!nearestEnemy) return;

    // Get or create projectile
    const projectile = this.projectiles.get(
      this.player.x,
      this.player.y,
      'projectile'
    ) as Phaser.Physics.Arcade.Sprite | null;

    if (projectile) {
      projectile.setActive(true);
      projectile.setVisible(true);
      projectile.setPosition(this.player.x, this.player.y);

      // Calculate direction to enemy
      const angle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        nearestEnemy.x,
        nearestEnemy.y
      );

      const speed = 400;
      projectile.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      // Destroy projectile after 3 seconds if it doesn't hit
      this.time.delayedCall(3000, () => {
        if (projectile.active) {
          projectile.setActive(false);
          projectile.setVisible(false);
        }
      });
    }
  }

  private findNearestEnemy(): Phaser.Physics.Arcade.Sprite | null {
    let nearest: Phaser.Physics.Arcade.Sprite | null = null;
    let nearestDist = Infinity;

    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );

      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    });

    return nearest;
  }

  private spawnEnemy(): void {
    if (this.gameOver) return;

    // Spawn at random edge of screen
    const edge = Phaser.Math.Between(0, 3);
    let x: number, y: number;

    switch (edge) {
      case 0: // Top
        x = Phaser.Math.Between(0, this.scale.width);
        y = -24;
        break;
      case 1: // Right
        x = this.scale.width + 24;
        y = Phaser.Math.Between(0, this.scale.height);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(0, this.scale.width);
        y = this.scale.height + 24;
        break;
      default: // Left
        x = -24;
        y = Phaser.Math.Between(0, this.scale.height);
        break;
    }

    // Choose random enemy sprite or use placeholder
    let textureName = 'enemy';
    if (!this.usePlaceholderGraphics && this.enemySpriteNames.length > 0) {
      textureName = Phaser.Math.RND.pick(this.enemySpriteNames);
    }

    const enemy = this.enemies.get(x, y, textureName) as Phaser.Physics.Arcade.Sprite | null;

    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      enemy.setPosition(x, y);

      if (!this.usePlaceholderGraphics) {
        enemy.play(`${textureName}-walk-down`);
        enemy.setScale(1.5);
      }
    }
  }

  private handleProjectileEnemyCollision(
    projectileObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const projectile = projectileObj as Phaser.Physics.Arcade.Sprite;
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    // Deactivate both
    projectile.setActive(false);
    projectile.setVisible(false);

    // Spawn XP gem at enemy position
    this.spawnXPGem(enemy.x, enemy.y);

    enemy.setActive(false);
    enemy.setVisible(false);
  }

  private spawnXPGem(x: number, y: number): void {
    const gem = this.xpGems.get(x, y, 'xpGem') as Phaser.Physics.Arcade.Sprite | null;

    if (gem) {
      gem.setActive(true);
      gem.setVisible(true);
      gem.setPosition(x, y);
    }
  }

  private handleXPCollection(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    gemObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const gem = gemObj as Phaser.Physics.Arcade.Sprite;

    gem.setActive(false);
    gem.setVisible(false);

    this.score += 10;
    this.callbacks.onScoreUpdate(this.score);
  }

  private handlePlayerEnemyCollision(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    if (this.isInvincible || this.gameOver) return;

    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    // Destroy enemy
    enemy.setActive(false);
    enemy.setVisible(false);

    // Damage player
    this.playerHP -= 20;
    this.callbacks.onHPUpdate(this.playerHP);

    if (this.playerHP <= 0) {
      this.handleGameOver();
      return;
    }

    // Brief invincibility
    this.isInvincible = true;
    this.player.setAlpha(0.5);

    this.time.delayedCall(1000, () => {
      this.isInvincible = false;
      this.player.setAlpha(1);
    });
  }

  private handleGameOver(): void {
    this.gameOver = true;
    this.fireTimer.remove();
    this.spawnTimer.remove();
    this.player.setVelocity(0, 0);
    this.callbacks.onGameOver();
  }

  // Public method to receive joystick input from React
  public setJoystickVector(x: number, y: number): void {
    this.joystickVector.x = x;
    this.joystickVector.y = y;
  }

  update(): void {
    if (this.gameOver) return;

    // Handle player movement
    let velocityX = 0;
    let velocityY = 0;

    // Keyboard input
    if (this.cursors?.left?.isDown || this.wasd?.A?.isDown) {
      velocityX -= 1;
    }
    if (this.cursors?.right?.isDown || this.wasd?.D?.isDown) {
      velocityX += 1;
    }
    if (this.cursors?.up?.isDown || this.wasd?.W?.isDown) {
      velocityY -= 1;
    }
    if (this.cursors?.down?.isDown || this.wasd?.S?.isDown) {
      velocityY += 1;
    }

    // Add joystick input
    velocityX += this.joystickVector.x;
    velocityY += this.joystickVector.y;

    // Normalize if diagonal
    const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (length > 1) {
      velocityX /= length;
      velocityY /= length;
    }

    this.player.setVelocity(
      velocityX * this.playerSpeed,
      velocityY * this.playerSpeed
    );

    // Update player animation based on direction
    if (!this.usePlaceholderGraphics && (velocityX !== 0 || velocityY !== 0)) {
      const direction = getDirectionFromVelocity(velocityX, velocityY);
      if (direction !== this.currentDirection) {
        this.currentDirection = direction;
        this.player.play(`${this.playerSpriteName}-walk-${direction}`);
      }
    }

    // Move enemies toward player
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );

      const enemySpeed = 80;
      enemy.setVelocity(
        Math.cos(angle) * enemySpeed,
        Math.sin(angle) * enemySpeed
      );
    });
  }
}
