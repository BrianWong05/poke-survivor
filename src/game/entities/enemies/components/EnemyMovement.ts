import Phaser from 'phaser';
import { type Enemy } from '../Enemy';

export class EnemyMovement {
  private enemy: Enemy;
  private scene: Phaser.Scene;
  
  // Status State
  public isKnockedBack: boolean = false;
  public isParalyzed: boolean = false;
  private originalSpeed: number = 0;

  constructor(enemy: Enemy) {
    this.enemy = enemy;
    this.scene = enemy.scene;
  }

  public init(speed: number): void {
      this.isKnockedBack = false;
      this.isParalyzed = false;
      this.originalSpeed = speed; // Captured initial speed? 
      // Actually speed can change based on stats. 
      // But for init it's fine.
  }

  public update(_delta: number): void {
      if (!this.enemy.target || !this.enemy.active) return;
      
      this.moveTowardTarget();
  }

  private moveTowardTarget(): void {
     // Check for knockback/stun
    if (this.isKnockedBack) return; 

    // If paralyzed, speed is 0 so moveToObject does nothing, but good to be explicit?
    // moveToObject uses current object x/y and target x/y.
    // If we rely on physics body velocity, we must ensure it's not overwritten if we want to stop.
    
    // In original code:
    // if (this.isKnockedBack) return;
    // this.scene.physics.moveToObject(this, this.target, this.speed);
    
    this.scene.physics.moveToObject(this.enemy, this.enemy.target!, this.enemy.speed);
  }

  public applyKnockback(force: Phaser.Math.Vector2, duration: number): void {
    if (this.enemy.isBoss) return; // Boss immunity

    this.isKnockedBack = true;
    
    // Apply velocity
    if (this.enemy.body) {
      (this.enemy.body as Phaser.Physics.Arcade.Body).setVelocity(force.x, force.y);
    }

    // Reset after duration
    this.scene.time.delayedCall(duration, () => {
      if (!this.enemy.active) return;
      this.isKnockedBack = false;
      // Movement will resume in next update
    });
  }

  public paralyze(duration: number): void {
     if (!this.enemy.active) return;

    // If not already paralyzed, store speed
    if (!this.isParalyzed) {
      this.originalSpeed = this.enemy.speed; // Store current speed
      this.isParalyzed = true;
      this.enemy.speed = 0;
      
      // Stop physics velocity immediately
      if (this.enemy.body) {
        (this.enemy.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      }
    }

    // Extend duration handling
    const now = this.scene.time.now;
    const currentExpiry = this.enemy.getData('paralyzedUntil') || 0;
    const newEndTime = Math.max(currentExpiry, now + duration);
    
    this.enemy.setData('paralyzedUntil', newEndTime);

    this.scene.time.delayedCall(duration, () => {
      if (!this.enemy.active || this.enemy.isDying) return;
      
      // Check if we should still be paralyzed
      if (this.scene.time.now >= this.enemy.getData('paralyzedUntil')) {
        this.cureParalysis();
      }
    });
  }

  private cureParalysis(): void {
    if (!this.isParalyzed) return;
    
    this.isParalyzed = false;
    this.enemy.speed = this.originalSpeed;
    
    // The Visuals component handles tint clearing? 
    // We need a way to communicate this or Visuals checks state?
    // Visuals.update calls flashHit with isParalyzed arg? No.
    // Enemy.ts should coordinate "Cure -> visuals.clearTint()"
    // But Movement doesn't know about Visuals.
    
    // Solution: Movement emits event? Or we just set flag and Enemy.updateVisuals handles it?
    // Or we expose a callback?
    // Let's call a method on Enemy if we want to be clean, or just access public field.
    // Enemy.visuals public field?
    
    // For now, let's make Enemy delegate this completely or Movement just sets state.
    // Issue: Visuals.flashHit needs to know about paralysis.
    // Visuals needs to clear tint when cured.
    
    // Let's add a callback or event.
    // Or simpler: Enemy.cureParalysis calls movement.cureParalysis AND visuals.clearTint.
    // But logic for "When to cure" is inside delayedCall in Movement.
    
    // Changing approach: Movement deals with stats only.
    // But delayedCall is here.
    
    // We will assume Enemy exposes `cureParalysis` which delegates to components.
    // But `delayedCall` is running inside Movement.
    // Movement can call `this.enemy.onParalysisCured()`?
    
    // Let's add `onParalysisCurred` method to Enemy public API, called by Movement.
    this.enemy.handleParalysisCured();
  }
}
