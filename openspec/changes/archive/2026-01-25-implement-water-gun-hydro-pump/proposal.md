# Implement Water Gun and Hydro Pump

## Goal
Implement Squirtle's innate weapon, **Water Gun**, which focuses on crowd control via **Knockback**. At Level 8, it evolves into **Hydro Pump**, a high-damage, high-knockback, infinite-pierce weapon.

## Context
Water Gun is a low-damage but high-utility weapon designed to keep enemies away. Hydro Pump transforms it into a path-clearing massive projectile.

## Capabilities

### Water Gun (Levels 1-7)
- **Visual**: Blue Circle (`0x00BFFF`).
- **Cooldown**: 900ms.
- **Damage**: 8.
- **Knockback**: 300 (Strong push).
- **Pierce**: 1 (Hits 2 targets).
- **Pattern**: Fires 1 shot at the nearest enemy.

### Hydro Pump (Level 8+)
- **Visual**: Blue Circle, Scale 3.0.
- **Backwards Compatible**: Logic resides in the same Weapon class but switches parameters based on level.
- **Cooldown**: 1500ms.
- **Damage**: 25.
- **Knockback**: 800 (Screen clearing push).
- **Pierce**: 999 (Effectively Infinite).
- **Pattern**: Fires massive high-speed slug.

### Knockback Mechanics
- Projectiles calculate a normalized vector from themselves to the enemy upon impact.
- This vector is multiplied by `knockbackForce`.
- The result is added to the enemy's current velocity.
