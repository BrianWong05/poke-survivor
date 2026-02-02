import type { WeaponConfig, CharacterContext } from '@/game/entities/characters/types';
import type { Player } from '@/game/entities/Player';

export abstract class Weapon implements WeaponConfig {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract cooldownMs: number;
  
  // Evolution property is optional in WeaponConfig
  evolution?: WeaponConfig;
  evolutionLevel?: number;

  /**
   * Calculates the final damage based on Weapon Base + Player Base * Player Might.
   * Formula: (WeaponBase + PlayerBase) * PlayerMight
   * 
   * @param weaponDamage The base damage of the weapon's current level/stats
   * @param player The player instance (owner)
   */
  protected getCalculatedDamage(weaponDamage: number, player: Player): number {
    // 1. Get Weapon Base (passed in)
    
    // 2. Get Player Base
    // Accessing stats directly. Ensure Player exposes this.
    const playerBase = player.stats.baseDamage || 0;

    // 3. Get Player Multiplier
    const playerMight = player.might || 1;

    // 4. Calculate Raw Damage
    const rawDamage = (weaponDamage + playerBase) * playerMight;

    // 5. Apply Random Variance (+/- 15%)
    // Range: 0.85 to 1.15
    const variance = 0.85 + (Math.random() * 0.30);
    
    // 6. Final Calculation (Rounded)
    const finalDamage = Math.round(rawDamage * variance);

    // Debug Log
    console.log(`[DamageCalc] Weapon: ${this.name} (${weaponDamage}) + PlayerBase: ${playerBase} (Might ${playerMight}) * Var: ${variance.toFixed(2)} = ${finalDamage}`);

    return finalDamage;
  }

  abstract fire(ctx: CharacterContext): void;
}
