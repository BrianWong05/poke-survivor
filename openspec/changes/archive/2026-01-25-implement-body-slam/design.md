# Design: Body Slam Implementation

## Architecture
The implementation follows the existing `WeaponConfig` --> `Entity` pattern, but with a new interaction type (Pulse).

### Shockwave Entity
`src/game/entities/projectiles/Shockwave.ts`

```typescript
export class Shockwave extends Phaser.Physics.Arcade.Sprite {
    private damage: number;
    private knockback: number;
    private radius: number;
    private stunDuration: number;
    private hitList: Set<string>; // Store Enemy IDs

    constructor(scene, x, y, config) {
        super(scene, x, y, 'ring-texture');
        // Setup stats
        // Start Tween (Scale 0.1 -> Target, Alpha 1 -> 0)
    }

    update() {
         // Follow player? Or stay static where spawned? 
         // Request says "Pulse (Centered on Player)", but usually shockwaves are static once spawned 'at' player. 
         // "Spawning at player.x, player.y" implies spawn point. 
         // "Centered on Player" usually implies it follows. 
         // *Decision*: Spawn at location and stay there (classic shockwave), UNLESS explicitly asked to follow.
         // Context: "Spawning at player.x, player.y" -> implies point of origin.
    }
}
```

### Hit Logic
- We cannot rely on standard `arcade.collide` separating bodies because we want overlap.
- We use `scene.physics.overlap(shockwave, enemyGroup, callback)`.
- **Callback**:
    1. Check if enemy.id is in `hitList`.
    2. If no:
        - Apply Damage.
        - Apply Knockback (Angle from Shockwave Center to Enemy).
        - Apply Stun (if Giga Impact).
        - Add to `hitList`.

### Stun Effect
- Enemies need a `stun(duration)` method or state.
- Existing `Enemy.ts` might not support stun.
- **Requirement Check**: Does `Enemy.ts` exist? YES. Check if it handles 'stun'. If not, we might need a small delta to `Enemy` or handle it by zeroing velocity for a duration.
