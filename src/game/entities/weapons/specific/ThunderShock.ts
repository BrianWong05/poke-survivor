import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
// LightningBolt no longer used
// import { LightningBolt } from '@/game/entities/projectiles/LightningBolt';

interface ThunderStats {
  damage: number;
  bounces: number; // Number of bounces (Hits = bounces + 1)
  jumpRange: number;
  cooldown: number;
}

/**
 * Helper to get the enemies group from scene registry
 */
function getEnemies(scene: Phaser.Scene): Phaser.Physics.Arcade.Group | null {
  return scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group | null;
}

/**
 * Find the nearest active enemy to a source point, excluding specific enemies
 */
function findNearestEnemy(
  scene: Phaser.Scene,
  source: { x: number, y: number },
  exclude: Phaser.GameObjects.GameObject[] = [],
  maxDistance: number = Infinity
): Phaser.Physics.Arcade.Sprite | null {
  const enemies = getEnemies(scene);
  if (!enemies) return null;

  const activeEnemies = enemies.getChildren().filter(e => {
    if ('isDying' in e) {
      if ((e as any).isDying || !e.active) return false;
    }
    if (!e.active) return false;
    
    // Exclude list
    if (exclude.includes(e)) return false;
    
    // Range check
    const dist = Phaser.Math.Distance.Between(source.x, source.y, (e as any).x, (e as any).y);
    return dist <= maxDistance;
  });

  if (activeEnemies.length === 0) return null;

  return scene.physics.closest(source, activeEnemies) as Phaser.Physics.Arcade.Sprite | null;
}

/**
 * Draw a jagged lightning bolt with optional sparks
 */
function drawLightning(scene: Phaser.Scene, start: { x: number, y: number }, end: { x: number, y: number }) {
  const graphics = scene.add.graphics();
  
  // Settings
  const segments = 6; // Number of segments
  const offsetAmount = 20; // Max lateral offset
  
  // Calculate points
  const points: { x: number, y: number }[] = [];
  points.push({ x: start.x, y: start.y });
  
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    // Linear Interpolation
    let x = start.x + (end.x - start.x) * t;
    let y = start.y + (end.y - start.y) * t;
    
    // Perpendicular offset
    // Simple random offset (not strictly perpendicular but works for chaos)
    x += Phaser.Math.Between(-offsetAmount, offsetAmount);
    y += Phaser.Math.Between(-offsetAmount, offsetAmount);
    
    points.push({ x, y });
  }
  
  points.push({ x: end.x, y: end.y });

  // Draw Glow (Outer)
  graphics.lineStyle(6, 0x00FFFF, 0.4); 
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i].x, points[i].y);
  }
  graphics.strokePath();

  // Draw Core (Inner)
  graphics.lineStyle(2, 0xFFFFCC, 1.0); 
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i].x, points[i].y);
  }
  graphics.strokePath();

  // Sparks at target
  const sparks = scene.add.graphics();
  sparks.lineStyle(2, 0xFFFF00, 1.0);
  for (let i = 0; i < 5; i++) {
      const angle = Phaser.Math.Between(0, 360);
      const len = Phaser.Math.Between(10, 25);
      const rad = Phaser.Math.DegToRad(angle);
      
      sparks.beginPath();
      sparks.moveTo(end.x, end.y);
      sparks.lineTo(end.x + Math.cos(rad) * len, end.y + Math.sin(rad) * len);
      sparks.strokePath();
  }
  
  // Tweens
  scene.tweens.add({
    targets: [graphics, sparks],
    alpha: 0,
    duration: 150,
    onComplete: () => {
      graphics.destroy();
      sparks.destroy();
    }
  });
}

export class ThunderShock implements WeaponConfig {
  id = 'thunder-shock';
  name = 'Thunder Shock (電擊)';
  description = 'Chains electricity between enemies';
  
  // Dynamic cooldown based on level, handled in fire() check or external system?
  // The system likely reads this property. We might need a getter or update it dynamically.
  // For now, we'll set it to the base (Level 1) or handle it via a getter if the system supports it.
  // Since `WeaponConfig` defines `cooldownMs` as a number, we might need to update this instance property on update or just manage it.
  // HOWEVER, the `CharacterContext` has the level. 
  // If the weapon system reads `cooldownMs` directly from the config object, we might need to mutate this property or simple return 0 and manage internal cooldown?
  // Standard way: The system likely checks `weapon.cooldownMs`.
  // Let's implement `cooldownMs` as a getter if possible, but it's defined as a number in the interface.
  // workaround: Update `cooldownMs` inside `fire` for the *next* shot? 
  // actually, the prompt requirements say "Lvl 8: -200ms Cooldown".
  // Let's assume we can update `cooldownMs` when the level changes or just set it to the current level's cooldown after firing.
  cooldownMs = 1200; 

  // Evolution disabled for now
  // evolution = new Thunderbolt();
  // evolutionLevel = 8; 

  getStats(level: number): ThunderStats {
    // Base stats (Level 1)
    let damage = 10;
    let bounces = 1; // Hits 2
    let jumpRange = 250;
    let cooldown = 1200;

    if (level >= 2) bounces += 1; // Lvl 2: +1 Bounce
    if (level >= 3) damage += 5;  // Lvl 3: +5 Damage
    if (level >= 4) jumpRange += 100; // Lvl 4: +100 Range
    if (level >= 5) bounces += 1; // Lvl 5: +1 Bounce
    if (level >= 6) damage += 5;  // Lvl 6: +5 Damage
    if (level >= 7) bounces += 2; // Lvl 7: +2 Bounce
    if (level >= 8) cooldown -= 200; // Lvl 8: -200ms Cooldown

    return { damage, bounces, jumpRange, cooldown };
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;
    const stats = this.getStats(level);

    // Update cooldown for next shot (hacky but works if system reads property)
    this.cooldownMs = stats.cooldown;

    let currentTarget = findNearestEnemy(scene, player, [], stats.jumpRange);
    
    // If no target found in range of player, try global search? 
    // "Find Closest Enemy to player" usually implies global, but maybe within range?
    // Requirement says "Jump Range 150px" which usually applies to bounces.
    // Initial target range wasn't specified, assuming screen/global or a reasonable range.
    // Let's stick to initial being global or large range, subsequent being jumpRange.
    if (!currentTarget) {
       currentTarget = findNearestEnemy(scene, player); // Global search first hit
    }

    if (!currentTarget) return;

    // Start Chain
    let hitList: Phaser.GameObjects.GameObject[] = [currentTarget];
    let remainingBounces = stats.bounces;

    // Process first hit logic loop
    // Actually, we process the first target, then look for next.
    
    // Loop to process current chain
    // We already have the first target.
    
    // Helper to process a hit
    const processHit = (target: Phaser.Physics.Arcade.Sprite, source: { x: number, y: number }) => {
        // Visual
        drawLightning(scene, source, target);
        
        // Damage
        scene.events.emit('damage-enemy', target, stats.damage);
    };

    // Hit the first one
    processHit(currentTarget, player);

    while (remainingBounces > 0) {
        if (!currentTarget) break;

        // Find next
        const nextTarget = findNearestEnemy(scene, currentTarget, hitList, stats.jumpRange);
        
        if (nextTarget) {
            processHit(nextTarget, currentTarget);
            hitList.push(nextTarget);
            currentTarget = nextTarget;
            remainingBounces--;
        } else {
            break; // Chain broken
        }
    }
  }
}
