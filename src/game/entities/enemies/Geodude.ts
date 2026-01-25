import Phaser from 'phaser';
import { Enemy } from '@/game/entities/enemies/Enemy';
import { EnemyType, ENEMY_STATS } from '@/game/entities/enemies/EnemyConfig';

/**
 * Geodude - Slow tank enemy with high HP and knockback resistance.
 * Speed: 40, HP: 50, Mass: 100
 * Movement: Direct chase toward player (but slow and heavy)
 */
export class Geodude extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const stats = ENEMY_STATS[EnemyType.GEODUDE];
    super(scene, x, y, stats.textureKey);
  }

  /**
   * Initialize with Geodude-specific stats including high mass.
   */
  public spawn(target: Phaser.Physics.Arcade.Sprite): void {
    const stats = ENEMY_STATS[EnemyType.GEODUDE];
    this.init(stats, target, EnemyType.GEODUDE);
  }

  /**
   * Geodude uses default direct chase movement.
   * Its high mass is set in init() for knockback resistance.
   */
}
