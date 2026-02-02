import Phaser from 'phaser';
import type { CharacterContext } from '@/game/entities/characters/types';
import { Weapon } from '@/game/entities/weapons/Weapon';

interface SludgeStats {
  damage: number;
  count: number;
  duration: number;
  radius: number;
  speed: number;
  cooldown: number;
}

class SludgeZone extends Phaser.GameObjects.Container {
  private lastTick: number = 0;
  private duration: number;
  private damage: number;
  private radius: number;
  private creationTime: number;
  private bubbles: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, stats: SludgeStats) {
    super(scene, x, y);
    this.duration = stats.duration;
    this.damage = stats.damage;
    this.radius = stats.radius;
    this.creationTime = scene.time.now;
    this.lastTick = scene.time.now;

    this.drawSludge(scene);
    
    // Add to scene
    scene.add.existing(this);
    this.setDepth(5); // Below players/enemies but above ground
  }

  private drawSludge(scene: Phaser.Scene) {
      const mainColor = 0x800080;
      const highlightColor = 0x9400D3;

      // 1. Main Blob (The Base)
      const base = scene.add.graphics();
      base.fillStyle(mainColor, 0.6);
      // Irregular circle shape
      const points = 8;
      const angleStep = (Math.PI * 2) / points;
      const pathPoints: {x: number, y: number}[] = [];
      
      for(let i=0; i < points; i++) {
          const angle = i * angleStep;
          // Random radius variation (0.8 to 1.0)
          const r = this.radius * Phaser.Math.FloatBetween(0.8, 1.0);
          pathPoints.push({
              x: Math.cos(angle) * r,
              y: Math.sin(angle) * r
          });
      }
      
      base.fillPoints(pathPoints, true);
      this.add(base);

      // 2. Satellite Bubbles (Static "Splats")
      for(let i=0; i<5; i++) {
         const bubble = scene.add.graphics();
         const bRadius = this.radius * Phaser.Math.FloatBetween(0.2, 0.4);
         const dist = this.radius * Phaser.Math.FloatBetween(0.4, 0.8);
         const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
         
         bubble.fillStyle(mainColor, 0.6);
         bubble.fillCircle(Math.cos(angle)*dist, Math.sin(angle)*dist, bRadius);
         this.add(bubble);
      }

      // 3. Animated Bubbles (Popping)
      for(let i=0; i<3; i++) {
          const bubble = scene.add.graphics();
          const bRadius = this.radius * Phaser.Math.FloatBetween(0.15, 0.25);
          bubble.fillStyle(highlightColor, 0.8);
          // Random Pos within radius
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const dist = this.radius * Phaser.Math.FloatBetween(0, 0.6);
          bubble.fillCircle(0, 0, bRadius);
          
          bubble.x = Math.cos(angle) * dist;
          bubble.y = Math.sin(angle) * dist;
          
          this.add(bubble);
          this.bubbles.push(bubble);

          // Animate them
          this.scene.tweens.add({
              targets: bubble,
              scale: { from: 0, to: 1.2 },
              alpha: { from: 1, to: 0 },
              duration: Phaser.Math.Between(500, 1000),
              ease: 'Sine.easeOut',
              repeat: -1,
              delay: Phaser.Math.Between(0, 500)
          });
      }
  }

  update(time: number, _delta: number) {
    // Check duration
    if (time > this.creationTime + this.duration) {
      this.destroy();
      return;
    }

    // Damage Tick
    if (time > this.lastTick + 500) {
      this.dealDamage();
      this.lastTick = time;
    }
  }

  private dealDamage() {
    const enemiesGroup = this.scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
    if (!enemiesGroup) return;

    const enemies = enemiesGroup.getChildren() as Phaser.Physics.Arcade.Sprite[];
    const rangeSq = this.radius * this.radius;

    enemies.forEach(enemy => {
      if (!enemy.active) return;

      const distSq = Phaser.Math.Distance.Squared(this.x, this.y, enemy.x, enemy.y);
      if (distSq <= rangeSq) {
         if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
            (enemy as any).takeDamage(this.damage);
         } else {
            this.scene.events.emit('damage-enemy', enemy, this.damage, true);
         }
      }
    });
  }
}

export class SludgeBomb extends Weapon {
  id = 'sludge-bomb';
  name = 'Sludge Bomb (污泥炸彈)';
  description = 'Lob a sludge bomb that creates a damaging puddle.';
  cooldownMs = 3000;
  
  evolution = undefined;
  evolutionLevel = 999;

  getStats(level: number): SludgeStats {
    const stats: SludgeStats = {
      damage: 10,
      count: 2, // Start at 2
      duration: 3000,
      radius: 100, // Start at 100
      speed: 300,
      cooldown: 3000
    };

    if (level >= 2) stats.duration = 4000; // +1000
    if (level >= 3) stats.damage = 15; // +5
    if (level >= 4) stats.count = 3; // +1 (Total 3)
    if (level >= 5) stats.radius = 120; // +20
    if (level >= 6) stats.count = 4; // +1 (Total 4)
    if (level >= 7) stats.damage = 25; // +10
    if (level >= 8) {
        stats.count = 5; // +1 (Total 5)
        stats.radius = 150; // +30 "Huge Area"
    }

    return stats;
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;
    const baseStats = this.getStats(level);

    // Calculate final damage once per volley/spawn
    const finalDamage = this.getCalculatedDamage(baseStats.damage, player);
    const stats = { ...baseStats, damage: finalDamage };
    
    // Distinct Targeting Logic: 
    // 1. Get all enemies
    const enemiesGroup = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
    let candidates: Phaser.Physics.Arcade.Sprite[] = [];
    
    if (enemiesGroup) {
        // 2. Filter by Range (400px) and Sort by Distance
        candidates = enemiesGroup.getChildren()
            .map(child => child as Phaser.Physics.Arcade.Sprite)
            .filter(e => e.active && Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) <= 400)
            .sort((a, b) => {
                const distA = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
                const distB = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
                return distA - distB;
            });
    }

    for (let i = 0; i < stats.count; i++) {
        let targetX: number;
        let targetY: number;

        // Try to target distinct enemy [i]
        if (i < candidates.length) {
            targetX = candidates[i].x;
            targetY = candidates[i].y;
        } else {
            // Fallback: Random spot near player (150px)
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const distance = Phaser.Math.FloatBetween(50, 150);
            targetX = player.x + Math.cos(angle) * distance;
            targetY = player.y + Math.sin(angle) * distance;
        }
        
        // Add small random offset to prevent perfect stacking (-20 to +20)
        targetX += Phaser.Math.FloatBetween(-20, 20);
        targetY += Phaser.Math.FloatBetween(-20, 20);

        // Visual Projectile (The Lob) - Make it a Blob Cluster
        const projectile = scene.add.container(player.x, player.y);
        
        // Core Blob
        const core = scene.add.circle(0, 0, 8, 0x800080, 1);
        // Smaller blobs
        const bit1 = scene.add.circle(-4, -4, 4, 0x9400D3, 0.8);
        const bit2 = scene.add.circle(4, 2, 3, 0x4B0082, 0.8);
        
        projectile.add([core, bit1, bit2]);
        projectile.setDepth(player.depth + 10);


        // Tween setup
        scene.tweens.add({
            targets: projectile,
            x: targetX,
            y: targetY,
            duration: 500,
            ease: 'Sine.easeInOut',
            onUpdate: (tween) => {
                // Simulate Arc by scaling Y or offsetting
                // Simple parabolic height offset could be done if we manually updated y in onUpdate, 
                // but standard tween moves X/Y linearly. 
                // Let's use scale to simulate "coming towards camera" or "lob height"
                // A simple "scale up then down" works well for top-down lobs.
                const p = tween.progress; // 0 to 1
                const heightScale = 1 + Math.sin(p * Math.PI) * 0.5; // Up to 1.5x at peak
                projectile.setScale(heightScale);
            },
            onComplete: () => {
                projectile.destroy();
                this.spawnSludgeZone(scene, targetX, targetY, stats);
            }
        });
        
        // Add a slight delay between shots if count > 1
        if (stats.count > 1) {
            // This loop happens instantly so we might want to delay the tweens slightly
            // But for simplicity, concurrent lobs are fine or we can use `delay: i * 100` in tween
        }
    }
  }

  private spawnSludgeZone(scene: Phaser.Scene, x: number, y: number, stats: SludgeStats) {
      const zone = new SludgeZone(scene, x, y, stats);
      
      // We need to register this zone to the scene's update list so its update() method runs
      // Phaser Graphics don't automatically run update().
      scene.events.on('update', zone.update, zone);
      
      // Cleanup listener when zone dies
      zone.once('destroy', () => {
          scene.events.off('update', zone.update, zone);
      });
  }
}
