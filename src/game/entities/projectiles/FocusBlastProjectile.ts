import Phaser from 'phaser';
import { Explosion } from './Explosion';

export class FocusBlastProjectile extends Phaser.Physics.Arcade.Sprite {
  // Stats
  public damageAmount = 0; // Explosion deals the damage usually? Or direct hit too?
  // Spec says: "On Hit: Spawns an Explosion... Explosion has a 50% Crit Chance... If it crits -> Instakills"
  // Does the projectile itself deal damage? 
  // "Damage 12" was for Aura Sphere. 
  // Usually evolution has higher damage.
  // Let's say projectile deals impact damage, AND explosion deals AOE.
  // Or just Explosion.
  // "The Kicker: The Explosion has a 50% Crit Chance."
  // I'll make the projectile deal 0 damage itself, and let the Explosion handle it?
  // Or maybe small impact damage.
  // Aura Sphere was 12. Focus Blast should be stronger.
  // Let's pass damage to Explosion.
  
  public speed = 200;
  private hasExploded = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile-focus-blast');

    // Visuals
    if (!scene.textures.exists('projectile-focus-blast')) {
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xFF4500); // Orange Red
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('projectile-focus-blast', 20, 20);
    }
    this.setTexture('projectile-focus-blast');
    
    // Scale 2.5
    this.setScale(2.5);
    this.setDepth(100);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics Body
    const radius = 10;
    this.setBodySize(radius * 2, radius * 2);
    this.setCircle(radius);
  }

  public explode(): void {
    if (this.hasExploded) return;
    this.hasExploded = true;

    // Spawn Explosion
    // Damage logic: Inherit from weapon? 
    // Let's assume passed damageAmount is what the Explosion should deal.
    new Explosion(this.scene, this.x, this.y, this.damageAmount);

    this.destroy();
  }

  onHit(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (this.hasExploded) return;
    
    this.explode();
  }
}
