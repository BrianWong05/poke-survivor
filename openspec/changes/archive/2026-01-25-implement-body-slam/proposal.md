# Proposal: Implement Snorlax's Body Slam

## Goal
Implement **Body Slam** and its evolution **Giga Impact** as the innate weapon for Snorlax. This weapon functions as a radial shockwave that pushes enemies away.

## Context
Snorlax is a "Tank" character. This weapon provides crowd control (Knockback/Stun) consistent with his "AFK Tank" archetype.

## Solution

### 1. Shockwave Entity
A `Phaser.Physics.Arcade.Sprite` that:
- Spawns at player location.
- Expands rapidly (scale 0.1 -> Target).
- Fades out (Alpha 1 -> 0).
- Uses `scene.physics.overlap` to hit enemies.
- Maintains a `hitList` to ensure each enemy is hit only once per pulse.

### 2. Body Slam Weapon Logic
- **Level 1-7**:
    - High Knockback (500).
    - Medium Radius (150px).
    - 20 Damage.
- **Level 8+ (Evolution: Giga Impact)**:
    - Massive Radius (400px).
    - Violet visual.
    - 50 Damage.
    - 1s Stun effect.

### 3. Physics & Interaction
- Instead of velocity-based projectiles, this uses a growing overlap zone.
- `fire()` spawns the Shockwave.
- Logic handled in Shockwave's `update` or via Scene overlap callback (checking `hitList`).

## Risks
- **Performance**: Large overlaps with many enemies might handle many checks. However, 2s cooldown mitigates this.
- **Visuals**: Without custom assets, we rely on generated graphics/shapes which might look basic.
