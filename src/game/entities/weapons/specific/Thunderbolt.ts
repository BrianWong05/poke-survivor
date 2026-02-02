import Phaser from 'phaser';
import type { CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';

interface ThunderboltStats {
  damage: number;
  count: number;
  cooldown: number;
  area: number;
  stunChance: number;
}

export class Thunderbolt extends Weapon {
  id = 'thunderbolt';
  name = 'Thunderbolt (十萬伏特)';
  description = 'Strikes random enemies with lightning from the sky.';
  
  // Cooldown managed by stats, but system might read this.
  // We'll return the base or update it in fire() if needed.
  cooldownMs = 1500;

  getStats(level: number): ThunderboltStats {
    let damage = 20;
    let count = 2;
    let cooldown = 1500;
    let area = 1.0;
    let stunChance = 0.3;

    if (level >= 2) damage += 10;
    if (level >= 3) count += 1;
    if (level >= 4) area += 0.5;
    if (level >= 5) count += 1;
    if (level >= 6) damage += 20;
    if (level >= 7) count += 2;
    if (level >= 8) count += 4; // Total 10

    return { damage, count, cooldown, area, stunChance };
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;
    const stats = this.getStats(level);
    this.cooldownMs = stats.cooldown;

    // 1. Get Enemies
    const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
    let targets: { x: number, y: number, enemy?: any }[] = [];

    if (enemiesGroup) {
      const activeEnemies = enemiesGroup.getChildren().filter(e => e.active && !(e as any).isDying);
      
      if (activeEnemies.length > 0) {
        // Shuffle and pick
        const shuffled = activeEnemies.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, stats.count);
        
        targets = selected.map(e => ({
          x: (e as any).x,
          y: (e as any).y,
          enemy: e
        }));
      }
    }

    // 2. Fallback if no enemies (or fill up count? Prompt says "Fallback: If no enemies are alive")
    // Note: The prompt implies fallback only if NO enemies. But for visual flair, maybe we strictly follow "No enemies alive".
    // Alternatively, if count > targets, should we strike random ground?
    // "Fallback: If no enemies are alive, strike random positions"
    if (targets.length === 0) {
      const camera = scene.cameras.main;
      for (let i = 0; i < stats.count; i++) {
        targets.push({
          x: camera.scrollX + Math.random() * camera.width,
          y: camera.scrollY + Math.random() * camera.height
        });
      }
    }

    // 3. Chaos Sequence (Random delays)
    // No sorting - let it be a random storm

    targets.forEach((target) => {
      // Random delay 0-250ms for that "pop pop pop" storm feel
      const delay = Math.random() * 250; 
      
      scene.time.delayedCall(delay, () => {
         this.spawnStrike(scene, target.x, target.y, stats.area);
      
         if (target.enemy) {
            // Calculate final damage (variance per strike)
            const finalDamage = this.getCalculatedDamage(stats.damage, player);

            // Instant Damage
            scene.events.emit('damage-enemy', target.enemy, finalDamage, true);
            
            // Stun
            if (Math.random() < stats.stunChance) {
               if (typeof target.enemy.applyStatus === 'function') {
                  target.enemy.applyStatus('stun', 1000);
               }
            }
         }
      });
    });

    // 5. Audio (disabled)
    // scene.sound.play('thunder', { volume: 0.4 }); 
  }

  private spawnStrike(scene: Phaser.Scene, x: number, y: number, scale: number) {
    const height = 450; 
    const startY = y - height;
    
    // Anchor graphics at the SKY (top source), so scaling grows downwards from sky
    const graphics = scene.add.graphics({ x: x, y: startY });
    
    // Visual Settings
    const segments = 8;
    // Core (Inner)
    graphics.lineStyle(4 * scale, 0xFFFFCC, 1);
    
    // Generate jagged points relative to (0,0) which is (x, startY)
    const points: {x: number, y: number}[] = [];
    points.push({ x: 0, y: 0 }); // Start (0,0)
    
    for (let i = 1; i < segments; i++) {
        const progress = i / segments;
        const targetY = height * progress; // Relative Y
        
        // Horizontal jitter
        const jitter = (Math.random() - 0.5) * 40 * scale; 
        
        points.push({ x: jitter, y: targetY });
    }
    points.push({ x: 0, y: height }); // End at target (relative)

    // Draw Outer Glow (Yellow)
    graphics.lineStyle(8 * scale, 0xFFFF00, 0.5);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let p of points) graphics.lineTo(p.x, p.y);
    graphics.strokePath();

    // Draw Inner Core (White)
    graphics.lineStyle(3 * scale, 0xFFFFFF, 1);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let p of points) graphics.lineTo(p.x, p.y);
    graphics.strokePath();

    // Impact Flash at target (relative x:0, y:height)
    graphics.fillStyle(0xFFFF00, 1);
    graphics.fillCircle(0, height, 20 * scale);
    graphics.fillStyle(0xFFFFFF, 0.8);
    graphics.fillCircle(0, height, 10 * scale);

    // Animation: Strike Down (ScaleY 0 -> 1)
    graphics.scaleY = 0;
    scene.tweens.add({
      targets: graphics,
      scaleY: 1,
      duration: 50, // Fast strike
      ease: 'Linear',
      onComplete: () => {
          // Fade out after strike
          scene.tweens.add({
              targets: graphics,
              alpha: 0,
              scaleX: 1.5, // Widen as it dissipates
              duration: 200,
              onComplete: () => graphics.destroy()
          });
      }
    });
  }
}
