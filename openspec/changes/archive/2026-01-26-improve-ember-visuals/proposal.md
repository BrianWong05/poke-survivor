# Proposal: Improve Ember Visuals

This proposal addresses the user requirement to redesign the Ember projectile, which is currently a "circle dot". We will replace it with a more flame-like, procedurally generated texture.

## Why
The current Ember projectile uses a placeholder white circle (`projectile-fireball`) which looks robotic and simple ("circle dot"). The user requested a redesign to match the fiery aesthetic of Pokémon moves.

## What Changes

### 1. Procedural Texture Generation (`TextureManager.ts`)
- Replace the simple 16x16 circle generation for `projectile-fireball` with a more complex 32x32 flame shape.
- **Visual Design:**
    - **Core:** Bright Yellow (0xFFFF00).
    - **Outer:** Orange/Red (0xFF4500).
    - **Shape:** Teardrop/Jagged shape drawn via `Phaser.Graphics` path commands.

### 2. Ember Weapon Update (`Ember.ts` / `Fireball.ts`)
- Ensure `Fireball` instances use the correct tint/blend mode to look glowing.
- Potentially add a simple `Phaser.GameObjects.Particles.ParticleEmitter` trailing the projectile for extra "juice" if performance allows (optional, but encouraged for "Wow" factor).

## Verification Plan
- **Manual**: Launch game, fire Ember, verify it looks like a flame and not a circle.
