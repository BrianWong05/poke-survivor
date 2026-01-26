import Phaser from 'phaser';
import { ENEMY_STATS, EnemyType } from '@/game/entities/enemies';

export class TextureManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createTextures(): void {
    // Player: Blue circle (32px) - fallback
    const playerGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x4a9eff, 1);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Enemy: Red square (24px) - generic fallback
    const enemyGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    enemyGraphics.fillStyle(0xff4a4a, 1);
    enemyGraphics.fillRect(0, 0, 24, 24);
    enemyGraphics.generateTexture('enemy', 24, 24);
    enemyGraphics.destroy();

    // Enemy variant placeholders (Active fallbacks)
    // We generate these with 'fallback-' prefix to always be available

    // Rattata: Purple circle (24px)
    const rattataStats = ENEMY_STATS[EnemyType.RATTATA];
    const rattataGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    rattataGraphics.fillStyle(rattataStats.placeholderColor, 1);
    rattataGraphics.fillCircle(12, 12, 12); // Radius = size/2
    rattataGraphics.generateTexture('fallback-' + rattataStats.textureKey, 24, 24);
    rattataGraphics.destroy();

    // Geodude: Grey circle (28px)
    const geodudeStats = ENEMY_STATS[EnemyType.GEODUDE];
    const geodudeGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    geodudeGraphics.fillStyle(geodudeStats.placeholderColor, 1);
    geodudeGraphics.fillCircle(14, 14, 14);
    geodudeGraphics.generateTexture('fallback-' + geodudeStats.textureKey, 28, 28);
    geodudeGraphics.destroy();

    // Zubat: Blue circle (20px)
    const zubatStats = ENEMY_STATS[EnemyType.ZUBAT];
    const zubatGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    zubatGraphics.fillStyle(zubatStats.placeholderColor, 1);
    zubatGraphics.fillCircle(10, 10, 10);
    zubatGraphics.generateTexture('fallback-' + zubatStats.textureKey, 20, 20);
    zubatGraphics.destroy();

    // Projectile: Lightning Bolt (Jagged Yellow Line)
    const projectileGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    projectileGraphics.lineStyle(2, 0xffff00, 1);
    
    // Draw zig-zag pattern
    projectileGraphics.beginPath();
    projectileGraphics.moveTo(0, 4);
    projectileGraphics.lineTo(8, 0);
    projectileGraphics.lineTo(16, 8);
    projectileGraphics.lineTo(24, 0);
    projectileGraphics.lineTo(32, 4);
    projectileGraphics.strokePath();

    projectileGraphics.generateTexture('projectile-lightning', 32, 8);
    projectileGraphics.destroy();

    // Projectile: Fireball (White Circle)
    const fireballGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    fireballGraphics.fillStyle(0xffffff, 1);
    fireballGraphics.fillCircle(8, 8, 8); // 16x16 size
    fireballGraphics.generateTexture('projectile-fireball', 16, 16);
    fireballGraphics.destroy();
  }
}
