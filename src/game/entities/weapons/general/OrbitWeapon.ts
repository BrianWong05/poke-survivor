import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import { OrbitProjectile } from '@/game/entities/projectiles/OrbitProjectile';

export interface OrbitVariantConfig {
  name: string;
  description: string; // Added description
  color: number;
  projectileCount: number;
  spinSpeed: number; // degrees per second
  radius: number;
  statusEffect: 'burn' | 'slow' | 'none';
  duration: number; // seconds (0 or Infinity for permanent?)
  cooldown: number; // milliseconds
  knockback?: number;
  damageMultiplier?: number; // scale base damage
  isPermanent?: boolean;
  texture?: string; // default to 'projectile' or specific tint
  
  // Custom behavior flags
  extraRings?: Array<{
    radiusMultiplier: number;
    countMultiplier?: number; // default 1
    speedMultiplier?: number; // default 1 or -1 for reverse spin?
    invertSpin?: boolean;
  }>;
}

export class OrbitWeapon implements WeaponConfig {
  id: string;
  name: string;
  description: string;
  cooldownMs: number;
  
  evolution?: WeaponConfig;
  evolutionLevel?: number;

  private config: OrbitVariantConfig;

  constructor(id: string, config: OrbitVariantConfig, evolution?: WeaponConfig, evolutionLevel: number = 8) {
    this.id = id;
    this.config = config;
    this.name = config.name;
    this.description = config.description;
    this.cooldownMs = config.cooldown;
    this.evolution = evolution;
    this.evolutionLevel = evolutionLevel;
  }

  fire(ctx: CharacterContext): void {
    const { scene, player, stats } = ctx;

    // Prevent stacking for permanent weapons
    if (this.config.isPermanent) {
      const activeKey = `weapon_active_${this.id}`;
      // Check if projectiles are still valid (simple check)
      if (player.getData(activeKey)) {
         return; 
      }
      player.setData(activeKey, true);
    }

    const spawnRing = (radius: number, count: number, speed: number, invert: boolean) => {
        const angleStep = 360 / count;
        const actualSpeed = invert ? -speed : speed;

        for (let i = 0; i < count; i++) {
            const startAngle = i * angleStep;
            
            const projectile = new OrbitProjectile(
                scene,
                player.x,
                player.y,
                this.config.texture || 'projectile',
                player,
                radius,
                actualSpeed,
                startAngle
            );

            // Visuals
            projectile.setTint(this.config.color);
            projectile.setScale(1.2); // Make them visible

            // Data for collision system
            const damage = stats.baseDamage * (this.config.damageMultiplier || 1);
            projectile.setData('damage', damage);
            projectile.setData('knockback', this.config.knockback || 0);
            projectile.setData('pierce', 999); // Infinite pierce effectively
            projectile.setData('owner', player);
            projectile.setData('weaponId', this.id);
            
            if (this.config.statusEffect !== 'none') {
                projectile.setData('statusEffect', this.config.statusEffect);
            }

            // Duration
            if (!this.config.isPermanent) {
                scene.time.delayedCall(this.config.duration * 1000, () => {
                    if (projectile.active) projectile.destroy();
                });
            }
        }
    };

    // Spawn Main Ring
    spawnRing(this.config.radius, this.config.projectileCount, this.config.spinSpeed, false);

    // Spawn Extra Rings (e.g. Leaf Storm)
    if (this.config.extraRings) {
        this.config.extraRings.forEach(ring => {
            const r = this.config.radius * ring.radiusMultiplier;
            const c = Math.floor(this.config.projectileCount * (ring.countMultiplier || 1));
            const s = this.config.spinSpeed * (ring.speedMultiplier || 1);
            const invert = ring.invertSpin || false;
            spawnRing(r, c, s, invert);
        });
    }
  }

  /**
   * Compatibility Filter
   * @param pokemonType - The generic type of the Pokemon (e.g., 'fire', 'water')
   * @param moveElement - The element of the move (e.g., 'fire', 'water')
   */
  static isCompatible(pokemonType: string, moveElement: string): boolean {
    if (!pokemonType || !moveElement) return false;
    return pokemonType.toLowerCase() === moveElement.toLowerCase();
  }
}

// ============================================================================
// VARIANTS
// ============================================================================

// --- FIRE (Flame Wheel -> Fire Spin) ---

// --- FIRE (Flame Wheel -> Fire Spin) ---
export const FIRE_SPIN_CONFIG: OrbitVariantConfig = {
    name: 'Fire Spin',
    description: 'Permanent ring of fire that burns enemies.',
    color: 0xff4400, // Orange/Red
    projectileCount: 6, // More projectiles
    spinSpeed: 200, // Very Fast
    radius: 90,
    statusEffect: 'burn',
    duration: 0, // Permanent
    isPermanent: true,
    cooldown: 5000, 
    damageMultiplier: 1.5,
};

export const fireSpin = new OrbitWeapon('fire-spin', FIRE_SPIN_CONFIG);

export const FLAME_WHEEL_CONFIG: OrbitVariantConfig = {
    name: 'Flame Wheel',
    description: 'A spinning wheel of fire. Causes burn.',
    color: 0xff0000,
    projectileCount: 4,
    spinSpeed: 150,
    radius: 90,
    statusEffect: 'burn',
    duration: 4,
    cooldown: 2000, 
    damageMultiplier: 1.2,
};

export const flameWheel = new OrbitWeapon(
  'flame-wheel',
  FLAME_WHEEL_CONFIG,
  fireSpin,
  8
);
// Adjust Fire Spin cooldown to be very long or handled differently?
// I'll leave it as is.

// --- WATER (Aqua Ring -> Hydro Ring) ---

// --- WATER (Aqua Ring -> Hydro Ring) ---
export const HYDRO_RING_CONFIG: OrbitVariantConfig = {
    name: 'Hydro Ring',
    description: 'A massive water ring with extreme knockback.',
    color: 0x0088ff,
    projectileCount: 5,
    spinSpeed: 80,
    radius: 160, // Doubled radius (80 * 2)
    statusEffect: 'none',
    knockback: 600, // Doubled knockback (300 * 2)
    duration: 4,
    cooldown: 6000,
};

export const hydroRing = new OrbitWeapon('hydro-ring', HYDRO_RING_CONFIG);

export const AQUA_RING_CONFIG: OrbitVariantConfig = {
    name: 'Aqua Ring',
    description: 'A protective ring of water. Knocks enemies back.',
    color: 0x00ffff,
    projectileCount: 4,
    spinSpeed: 90, // Slow
    radius: 80,
    statusEffect: 'none',
    knockback: 300, // High Knockback
    duration: 4,
    cooldown: 6000,
};

export const aquaRing = new OrbitWeapon(
  'aqua-ring',
  AQUA_RING_CONFIG,
  hydroRing,
  8
);

// --- GRASS (Magical Leaf -> Leaf Storm) ---

// --- GRASS (Magical Leaf -> Leaf Storm) ---
export const LEAF_STORM_CONFIG: OrbitVariantConfig = {
    name: 'Leaf Storm',
    description: 'A storm of leaves shreds enemies.',
    color: 0x00ff00,
    projectileCount: 6,
    spinSpeed: 160,
    radius: 140, // Outer ring
    statusEffect: 'none',
    duration: 4,
    cooldown: 6000,
    damageMultiplier: 1.3,
    extraRings: [
        { radiusMultiplier: 0.6, countMultiplier: 0.6, invertSpin: true } // Inner ring, smaller, fewer, reverse spin?
    ]
};

export const leafStorm = new OrbitWeapon('leaf-storm', LEAF_STORM_CONFIG);

export const MAGICAL_LEAF_CONFIG: OrbitVariantConfig = {
    name: 'Magical Leaf',
    description: 'Sharp leaves that never miss.',
    color: 0x44ff44,
    projectileCount: 5,
    spinSpeed: 135, // Medium
    radius: 100,
    statusEffect: 'none',
    duration: 4,
    cooldown: 6000, 
    damageMultiplier: 1.0, 
    // "High Pierce" - Orbit projectiles pierce by default in our impl.
};

export const magicalLeaf = new OrbitWeapon(
  'magical-leaf',
  MAGICAL_LEAF_CONFIG,
  leafStorm,
  8
);
