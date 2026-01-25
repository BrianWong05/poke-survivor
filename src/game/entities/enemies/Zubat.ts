import Phaser from 'phaser';
import { Enemy } from '@/game/entities/enemies/Enemy';
import { EnemyType, ENEMY_STATS } from '@/game/entities/enemies/EnemyConfig';

/**
 * Zubat - Fast rusher with evasive sine-wave movement.
 * Speed: 140, HP: 5
 * Movement: Moves toward player with perpendicular sine-wave offset
 */
export class Zubat extends Enemy {
  /** Amplitude of the sine-wave offset in pixels */
  private readonly waveAmplitude: number = 50;

  /** Period of the sine-wave in milliseconds */
  private readonly wavePeriod: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const stats = ENEMY_STATS[EnemyType.ZUBAT];
    super(scene, x, y, stats.textureKey);
  }

  /**
   * Initialize with Zubat-specific stats.
   */
  public spawn(target: Phaser.Physics.Arcade.Sprite): void {
    const stats = ENEMY_STATS[EnemyType.ZUBAT];
    this.init(stats, target, EnemyType.ZUBAT);
  }

  /**
   * Override movement to use sine-wave evasion pattern.
   * Moves toward player but oscillates perpendicular to the movement direction.
   */
  protected moveTowardTarget(): void {
    if (!this.target || !this.scene) return;

    // Calculate base angle toward target
    const baseAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );

    // Calculate sine-wave offset perpendicular to movement direction
    const offset = Math.sin(this.scene.time.now / this.wavePeriod) * this.waveAmplitude;
    const perpAngle = baseAngle + Math.PI / 2;

    // Apply offset to target position
    const offsetX = Math.cos(perpAngle) * offset;
    const offsetY = Math.sin(perpAngle) * offset;

    const targetX = this.target.x + offsetX;
    const targetY = this.target.y + offsetY;

    // Move toward offset target
    this.scene.physics.moveTo(this, targetX, targetY, this.speed);
  }
}
