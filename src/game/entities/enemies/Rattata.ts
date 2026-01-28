import Phaser from 'phaser';
import { Enemy } from '@/game/entities/enemies/Enemy';
import { type EnemyStats, EnemyType, ENEMY_STATS } from '@/game/entities/enemies/EnemyConfig';

/**
 * Rattata - Fast chaff enemy that swarms the player.
 * Speed: 100, HP: 10
 * Movement: Direct chase toward player
 */
export class Rattata extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const stats = ENEMY_STATS[EnemyType.RATTATA];
    super(scene, x, y, stats.textureKey);
  }

  /**
   * Initialize with Rattata-specific stats.
   */
  public spawn(target: Phaser.Physics.Arcade.Sprite, statsOverride?: EnemyStats): void {
    const stats = statsOverride || ENEMY_STATS[EnemyType.RATTATA];
    this.init(stats, target, EnemyType.RATTATA);
  }

  /**
   * Rattata uses default direct chase movement.
   * No override needed - uses base class moveTowardTarget().
   */
}
