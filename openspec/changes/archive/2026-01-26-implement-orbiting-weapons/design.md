# Design: Orbiting Weapon System

## Architecture

### 1. `OrbitProjectile`
*   **Extends**: `Phaser.Physics.Arcade.Sprite`
*   **Responsibility**: Visual position tracking and collision body separation (though position is manually managed).
*   **Physics**: Velocity is NOT used for movement. Position is set in `update()` based on `angle` and `distance`.
    *   `x = center.x + cos(angle) * radius`
    *   `y = center.y + sin(angle) * radius`
    *   `angle += speed * delta`
*   **Rotation**: `this.rotation` should be set to `angle + Math.PI/2` (tangent to circle) or similar to face travel direction.

### 2. `OrbitWeapon`
*   **Implements**: `WeaponConfig` (effectively, though as a class instance).
*   **Responsibility**: Spawning `OrbitProjectile`s, managing cooldowns and duration.
*   **State**: None stored on the class itself (it's statutory/config), but manages projectiles via the Scene's projectile group.
*   **Configuration**:
    *   `OrbitWeaponConfig` interface extending `WeaponConfig` or separate `VariantConfig`.
    *   Fields: `projectileCount`, `radius`, `spinSpeed`, `statusEffect`, `duration`, `isPermanent` (for Fire Spin).

### 3. Variants
*   **Flame Wheel**: Short duration, fast spin, burn.
*   **Aqua Ring**: Slower spin, high knockback.
*   **Magical Leaf**: Pierce focused.

## Compatibility & Filtering
*   Static method `OrbitWeapon.isCompatible(pokemonType, moveElement)` will check if a Pokemon's type (e.g. Fire) matches the move's element (Fire).
*   This will likely rely on string matching for now (e.g. 'fire' === 'fire').

## Data Flow
1.  `Player` calls `currentWeapon.fire(ctx)`.
2.  `OrbitWeapon` calculates spread angles: `(360 / count) * i`.
3.  `OrbitWeapon` instantiates `OrbitProjectile`s.
4.  `OrbitProjectile` updates its own position relative to `Player` every frame.
