# Psywave Design

## Architecture
We will implement `Psywave` as a self-contained weapon file `src/game/entities/weapons/specific/Psywave.ts` implementing the `WeaponConfig` interface.

### Component Structure
1.  **Psywave (Class):** Main entry point. Handles `getStats` level scaling and `fire` orchestration.
2.  **PsywaveShot (Class):** Physics and logic for the individual projectile.

## Key Decisions

### Self-Contained Implementation
Instead of using the generic `OrbitWeapon`, we implement a custom class because:
-   **Complex Level Scaling:** Psywave levels update Count, Duration, Speed, and Radius in a non-linear way that doesn't fit the simple key/value scaling of the generic `OrbitWeapon`.
-   **Specific Logic:** Requirement for "Infinite" duration at Level 8 requires custom check in the `fire` loop to prevent re-spawning orbital rings if they are already active.

### Infinite Duration Handling (Level 8)
-   **State Tracking:** The `Psywave` class does not maintain state, but we can check if projectiles exist in the scene.
-   **Check:** When `fire()` is called at Level 8, checking if `projectilesGroup` already contains active `PsywaveShot` instances owned by the player. If so, do nothing.

### Immunity Timer
-   **Problem:** Orbiting projectiles stay inside enemies for long periods. Standard collision would hit 60 times/sec.
-   **Solution:** Use a `hitList` map on the projectile `Map<GameObject, number>` where number is the timestamp of the last hit.
-   **Logic:** `if (now > lastHit + 500ms) { dealDamage(); updateLastHit(); }`
