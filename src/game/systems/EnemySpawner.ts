import Phaser from 'phaser';
import {
  EnemyType,
  Enemy,
  Rattata,
  Geodude,
  Zubat,
} from '@/game/entities/enemies';

/**
 * Wave configuration for enemy spawning.
 */
interface WaveConfig {
  /** Time in seconds when this wave starts */
  startTime: number;
  /** Enemy types that can spawn during this wave */
  types: EnemyType[];
  /** Spawn interval in milliseconds */
  interval: number;
}

/**
 * Wave configurations for difficulty progression.
 */
const WAVE_CONFIG: WaveConfig[] = [
  { startTime: 0, types: [EnemyType.RATTATA], interval: 1000 },
  { startTime: 60, types: [EnemyType.RATTATA, EnemyType.ZUBAT], interval: 500 },
  { startTime: 120, types: [EnemyType.RATTATA, EnemyType.ZUBAT, EnemyType.GEODUDE], interval: 200 },
];

/**
 * Spawn radius around the player (outside camera view).
 */
const SPAWN_RADIUS = 600;

/**
 * Maximum pool size per enemy type.
 */
const POOL_SIZE_PER_TYPE = 100;

/**
 * EnemySpawner manages enemy spawning, object pooling, and wave progression.
 */
export class EnemySpawner {
  private scene: Phaser.Scene;
  private player: Phaser.Physics.Arcade.Sprite;

  /** Pools for each enemy type */
  private rattataPool: Phaser.GameObjects.Group;
  private geodudePool: Phaser.GameObjects.Group;
  private zubatPool: Phaser.GameObjects.Group;

  /** Combined group for collision detection */
  private allEnemies: Phaser.GameObjects.Group;

  /** Spawn timer */
  private spawnTimer: Phaser.Time.TimerEvent | null = null;

  /** Elapsed game time in seconds */
  private elapsedTime: number = 0;

  /** Current wave index */
  private currentWaveIndex: number = 0;

  /** Whether spawning is active */
  private isActive: boolean = false;

  constructor(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Sprite) {
    this.scene = scene;
    this.player = player;

    // Create object pools for each enemy type
    this.rattataPool = this.createPool(Rattata, 'enemy-rattata');
    this.geodudePool = this.createPool(Geodude, 'enemy-geodude');
    this.zubatPool = this.createPool(Zubat, 'enemy-zubat');

    // Create combined group for collision detection
    this.allEnemies = this.scene.add.group();
  }

  /**
   * Create an object pool for a specific enemy type.
   */
  private createPool(
    classType: typeof Rattata | typeof Geodude | typeof Zubat,
    _textureKey: string
  ): Phaser.GameObjects.Group {
    return this.scene.physics.add.group({
      classType: classType,
      maxSize: POOL_SIZE_PER_TYPE,
      runChildUpdate: true, // Enable preUpdate calls on children
      createCallback: (gameObject) => {
        const enemy = gameObject as Enemy;
        // Ensure the enemy is initially inactive
        enemy.setActive(false);
        enemy.setVisible(false);
      },
    });
  }

  /**
   * Start the enemy spawning system.
   */
  public start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.elapsedTime = 0;
    this.currentWaveIndex = 0;

    // Start with first wave's interval
    this.updateSpawnTimer();
  }

  /**
   * Stop enemy spawning.
   */
  public stop(): void {
    this.isActive = false;
    if (this.spawnTimer) {
      this.spawnTimer.remove();
      this.spawnTimer = null;
    }
  }

  /**
   * Update the spawner (call each frame).
   * @param delta Delta time in milliseconds
   */
  public update(delta: number): void {
    if (!this.isActive) return;

    // Update elapsed time
    this.elapsedTime += delta / 1000;

    // Check for wave progression
    const newWaveIndex = this.getCurrentWaveIndex();
    if (newWaveIndex !== this.currentWaveIndex) {
      this.currentWaveIndex = newWaveIndex;
      this.updateSpawnTimer();
    }
  }

  /**
   * Get the current wave index based on elapsed time.
   */
  private getCurrentWaveIndex(): number {
    for (let i = WAVE_CONFIG.length - 1; i >= 0; i--) {
      if (this.elapsedTime >= WAVE_CONFIG[i].startTime) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Update the spawn timer based on current wave configuration.
   */
  private updateSpawnTimer(): void {
    // Remove existing timer
    if (this.spawnTimer) {
      this.spawnTimer.remove();
    }

    const wave = WAVE_CONFIG[this.currentWaveIndex];

    // Create new timer with current wave's interval
    this.spawnTimer = this.scene.time.addEvent({
      delay: wave.interval,
      callback: () => this.spawnEnemy(),
      loop: true,
    });
  }

  /**
   * Spawn a single enemy at a random position around the player.
   */
  private spawnEnemy(): void {
    if (!this.isActive) return;

    const wave = WAVE_CONFIG[this.currentWaveIndex];

    // Pick random enemy type from current wave
    const enemyType = Phaser.Math.RND.pick(wave.types);

    // Calculate spawn position on circle around player
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const spawnX = this.player.x + Math.cos(angle) * SPAWN_RADIUS;
    const spawnY = this.player.y + Math.sin(angle) * SPAWN_RADIUS;

    // Get enemy from appropriate pool
    const enemy = this.getEnemyFromPool(enemyType, spawnX, spawnY);

    if (enemy) {
      // Add to combined group for collision detection
      this.allEnemies.add(enemy);
    }
  }

  /**
   * Get an enemy from the appropriate pool and initialize it.
   */
  private getEnemyFromPool(
    type: EnemyType,
    x: number,
    y: number
  ): Enemy | null {
    let pool: Phaser.GameObjects.Group;
    let enemy: Enemy | null = null;

    switch (type) {
      case EnemyType.RATTATA:
        pool = this.rattataPool;
        enemy = pool.get(x, y) as Rattata | null;
        if (enemy) {
          (enemy as Rattata).spawn(this.player);
        }
        break;

      case EnemyType.GEODUDE:
        pool = this.geodudePool;
        enemy = pool.get(x, y) as Geodude | null;
        if (enemy) {
          (enemy as Geodude).spawn(this.player);
        }
        break;

      case EnemyType.ZUBAT:
        pool = this.zubatPool;
        enemy = pool.get(x, y) as Zubat | null;
        if (enemy) {
          (enemy as Zubat).spawn(this.player);
        }
        break;
    }

    if (enemy) {
      enemy.setPosition(x, y);
    }

    return enemy;
  }

  /**
   * Get the combined enemy group for collision detection.
   */
  public getEnemyGroup(): Phaser.GameObjects.Group {
    return this.allEnemies;
  }

  /**
   * Get all active enemies across all pools.
   */
  public getActiveEnemies(): Enemy[] {
    const allPools = [this.rattataPool, this.geodudePool, this.zubatPool];
    const activeEnemies: Enemy[] = [];

    for (const pool of allPools) {
      pool.getChildren().forEach((child) => {
        const enemy = child as Enemy;
        if (enemy.active) {
          activeEnemies.push(enemy);
        }
      });
    }

    return activeEnemies;
  }

  /**
   * Get the count of active enemies.
   */
  public getActiveCount(): number {
    let count = 0;

    [this.rattataPool, this.geodudePool, this.zubatPool].forEach((pool) => {
      pool.getChildren().forEach((child) => {
        if ((child as Enemy).active) {
          count++;
        }
      });
    });

    return count;
  }

  /**
   * Get the elapsed game time in seconds.
   */
  public getElapsedTime(): number {
    return this.elapsedTime;
  }

  /**
   * Get reference to individual pools for physics overlap setup.
   */
  public getRattataPool(): Phaser.GameObjects.Group {
    return this.rattataPool;
  }

  public getGeodudePool(): Phaser.GameObjects.Group {
    return this.geodudePool;
  }

  public getZubatPool(): Phaser.GameObjects.Group {
    return this.zubatPool;
  }

  /**
   * Destroy all enemies and clean up.
   */
  public destroy(): void {
    this.stop();

    this.rattataPool.destroy(true);
    this.geodudePool.destroy(true);
    this.zubatPool.destroy(true);
    this.allEnemies.destroy(true);
  }
}
