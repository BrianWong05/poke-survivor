# Proposal: Implement Charmander's Ember

**Goal**: Implement the "Ember" weapon for Charmander, which serves as a basic single-target projectile launcher and evolves into "Flamethrower" (rapid-fire stream) at Level 8.

## Capabilities

### 1. Ember (Level 1-7)
- **Behavior**: Fires a single `Fireball` projectile at the nearest enemy.
- **Stats**: High damage (10), Slow cooldown (1200ms), Single target (0 pierce).
- **Visual**: Red circle projectile (`0xFF4500`).

### 2. Flamethrower (Level 8+)
- **Behavior**: Fires a stream of `Fireball` projectiles (Rapid Fire).
- **Stats**: Lower damage (6), Very fast cooldown (150ms), Multi-target (3 pierce).
- **Visual**: Orange tint (`0xFFA500`), slightly smaller size.

### 3. Projectile - Fireball
- **Logic**: Standard linear projectile.
- **Collision**: Piercing capability. Decrements pierce count on hit. Destroys when pierce < 0.
- **Visuals**: Simple circle sprite with tint support.

## Architecture
- **Projectile Class**: `src/game/entities/projectiles/Fireball.ts` extending `Phaser.Physics.Arcade.Sprite`.
- **Weapon Class**: `src/game/entities/weapons/specific/Ember.ts` implementing `WeaponConfig`.
- **Integration**: Register in `GameData.ts`.

## Trade-offs
- **Update Loop**: Unlike the previous "Burst" proposal, this uses a standard cooldown reduction to simulate "stream" behavior (150ms cooldown). This fits within the existing `fire()` paradigm without needing a custom `onUpdate` loop in `WeaponConfig`, simplifying the implementation.
