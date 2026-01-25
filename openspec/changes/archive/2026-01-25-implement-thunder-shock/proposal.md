# Implement Thunder Shock Weapon

## Summary
Implement Pikachu's innate weapon "Thunder Shock" as a dedicated class `ThunderShock` and its projectile `LightningBolt`, replacing the inline configuration.

## Problem Statement
Currently, weapons are defined as simple configuration objects inline in `weapons/index.ts`. To support more complex behavior (like custom projectiles, specific movement logic, and visual effects), we need a structured class-based approach. The user specifically requested a `ThunderShock` class and a `LightningBolt` projectile class.

## Proposed Solution
1.  **Weapon Class**: Create `src/game/entities/weapons/specific/ThunderShock.ts` implementing `WeaponConfig`.
2.  **Projectile Class**: Create `src/game/entities/projectiles/LightningBolt.ts` extending `Phaser.Physics.Arcade.Sprite`.
3.  **Integration**: Update `pikachuConfig` to use the new `ThunderShock` instance.
4.  **Evolution**: Implement evolution logic to `Thunderbolt`.

## Impacts
-   **Codebase**: Adds new files in `entities/weapons/specific` and `entities/projectiles`.
-   **State**: No change to global state structure, but `ThunderShock` will handle its own logic.
-   **Performance**: Uses custom class instances. Pooling strategy might need adjustment if high frequency.
