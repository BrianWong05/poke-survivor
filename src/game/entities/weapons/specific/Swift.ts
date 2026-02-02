import Phaser from 'phaser';
import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types'; // Assuming this import path based on SludgeBomb
import { SwiftShot } from '@/game/entities/projectiles/SwiftShot';
import { Weapon } from '@/game/entities/weapons/Weapon';

interface SwiftStats {
  damage: number;
  count: number;
  pierce: number;
  speed: number;
  cooldown: number;
  knockback: number;
}

export class Swift extends Weapon implements WeaponConfig {
  id = 'swift';
  name = 'Swift (高速星星)';
  description = 'Fires a high-speed volley of stars in a parallel wall.';
  cooldownMs = 1200; // Base cooldown
  
  evolution = undefined;
  evolutionLevel = 999;

  getStats(level: number): SwiftStats {
    const stats: SwiftStats = {
      damage: 10,
      count: 2,
      pierce: 1,
      speed: 800,
      cooldown: 1200,
      knockback: 100
    };

    if (level >= 2) stats.damage += 5; // Total 15
    if (level >= 3) stats.count += 1; // Total 3
    if (level >= 4) stats.pierce += 1; // Total 2
    if (level >= 5) stats.count += 1; // Total 4
    if (level >= 6) stats.speed += 200; // Total 1000
    if (level >= 7) stats.damage += 10; // Total 25
    if (level >= 8) stats.count += 2; // Total 6

    return stats;
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, level } = ctx;
    const stats = this.getStats(level);

    // Get Projectiles Group for Collision
    const projectilesGroup = scene.registry.get('projectilesGroup') as Phaser.Physics.Arcade.Group;
    if (!projectilesGroup) {
        console.warn('Projectiles group not found in registry');
        return;
    }
    
    // Determine 360 Direction based on Velocity
    const body = player.body as Phaser.Physics.Arcade.Body;
    let angleRad = 0;

    // Check if moving (magnitude > 10 to avoid drift noise)
    if (body.velocity.length() > 10) {
        // Attack in movement direction
        angleRad = body.velocity.angle();
    } else {
        // Stationary: Fallback to last known 8-way facing
        const facingDir = player.getData('facingDirection') as string || 'down';
        let angleDeg = 90; // Default down
        
        switch (facingDir) {
            case 'right': angleDeg = 0; break;
            case 'down-right': angleDeg = 45; break;
            case 'down': angleDeg = 90; break;
            case 'down-left': angleDeg = 135; break;
            case 'left': angleDeg = 180; break;
            case 'up-left': angleDeg = -135; break;
            case 'up': angleDeg = -90; break;
            case 'up-right': angleDeg = -45; break;
            default: 
                angleDeg = (player.getData('horizontalFacing') === 'left') ? 180 : 0;
                break;
        }
        angleRad = Phaser.Math.DegToRad(angleDeg);
    }

    const finalDamage = this.getCalculatedDamage(stats.damage, player);

    // Calculate Velocity Vector for Projectiles
    const velocity = new Phaser.Math.Vector2();
    scene.physics.velocityFromRotation(angleRad, stats.speed, velocity);
    
    // Positioning "Wall" Logic (Perpendicular to fire direction)
    const spacing = 20;
    
    // Perpendicular angle (90 degrees offset)
    const perpAngle = angleRad + (Math.PI / 2);
    const perpX = Math.cos(perpAngle);
    const perpY = Math.sin(perpAngle);

    // Center offset
    // Total width of the wall
    const wallWidth = (stats.count - 1) * spacing;
    // We want to start at -HalfWidth relative to center along the perpendicular axis
    const startOffset = -(wallWidth / 2);

    // Staggered Burst Fire (Delay between shots)
    // 50ms delay between each star
    const delayPerShot = 50; 
    
    // Create and shuffle indices for random spawn order within the wall
    const indices = Array.from({ length: stats.count }, (_, i) => i);
    Phaser.Utils.Array.Shuffle(indices);

    for (let i = 0; i < stats.count; i++) {
        scene.time.delayedCall(i * delayPerShot, () => {
             // Re-verify scene active
             if (!scene.sys || !scene.sys.isActive()) return;

             // Use the shuffled index to determine position in the wall
             // 'i' determines WHEN it fires (stagger)
             // 'positionIndex' determines WHERE it fires (position)
             const positionIndex = indices[i];

             // Distance along the perpendicular vector based on valid positionIndex
             const currentShift = startOffset + (positionIndex * spacing);
             
             // Calculate spawn position relative to CURRENT player position 
             // (Or captured player position? "Parallel Volley" usually moves WITH player if player moves?
             // Or spawns from where player was? Swift usually spawns from player.)
             // Let's spawn from CURRENT player position so it looks like a stream from the moving player.
             
             const spawnX = player.x + (perpX * currentShift);
             const spawnY = player.y + (perpY * currentShift);
             
             // Spawn
             const projectile = new SwiftShot(scene, spawnX, spawnY);
             
             // Register collision group FIRST to ensure body is managed by group
             // and doesn't reset properties after setup
             projectilesGroup.add(projectile);
             
             projectile.setup({
                 damage: finalDamage,
                 speed: stats.speed,
                 pierce: stats.pierce,
                 velocity: velocity
             });
        });
    }
  }
}
