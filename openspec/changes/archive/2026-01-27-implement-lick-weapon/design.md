# Design: Lick Weapon

## Components

### `LickHitbox`
- Extends: `Phaser.GameObjects.Rectangle` (or `Zone` with Graphics child)
- Physics: Arcade Physics Body (overlap only)
- **Key Methods**:
    - `constructor(scene, x, y, width, height, damage, duration, paralysisChance)`
    - `onOverlap(enemy)`
    - `calculateDamage()`: returns `baseDamage * (0.85 ^ hitsSoFar)`

### `Lick` (WeaponConfig)
- **Stat Implementation**:
    - Uses standard `getStats` pattern.
    - `area` stats maps to Hitbox Width/Scale.
- **Fire Logic**:
    - Calculates offset based on `player.flipX`.
    - Instantiates `LickHitbox`.

## Paralysis Implementation
- Since `applyKnockback` usually takes a vector and duration, passing `Vector2(0,0)` is a clever way to re-use the Stun mechanism without pushing. 
- Ensure `applyKnockback` in `Enemy` handles 0-vector correctly (i.e. sets velocity to 0 and disables movement). *Assumption: It does based on user request.*

## Edge Cases
- **Attack Speed**: High cooldown reductions might overlap animations.
- **HitList**: Must clear hitlist on destroy or ensure unique hit per instance.
