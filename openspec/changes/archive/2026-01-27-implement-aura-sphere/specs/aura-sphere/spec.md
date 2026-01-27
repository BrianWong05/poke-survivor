# Aura Sphere Weapon Spec

## MODIFIED Requirements

### Requirement: Aura Sphere Progression
The weapon MUST follow a strict 8-level progression for damage, count, pierce, and homing capabilities.

#### Scenario: Level 1 Stats
- **Damage:** 12
- **Count:** 1
- **Pierce:** 1 (Hits 2 enemies total)
- **Speed:** 500
- **TurnRate:** 180 degrees/sec
- **Cooldown:** 1500ms

#### Scenario: Level Progression
- **Lvl 2:** Damage +4 (Total 16)
- **Lvl 3:** Count +1 (Total 2)
- **Lvl 4:** Pierce +1 (Total 2, Hits 3 enemies)
- **Lvl 5:** TurnRate 360 degrees/sec (Aggressive homing)
- **Lvl 6:** Count +1 (Total 3)
- **Lvl 7:** Pierce +1 (Total 3, Hits 4 enemies)
- **Lvl 8:** TurnRate 999 degrees/sec (Instant snapping / inescapable)

### Requirement: Homing Behavior
Projectiles MUST actively steer towards targets during flight.

#### Scenario: Flight Logic
- **Targeting:** In `update()`, identify the nearest enemy to the *projectile* (not the player).
- **Steering:** Calculate angle difference between current velocity and angle to enemy.
- **Rotation:** Rotate velocity vector by `turnRate * delta` towards the enemy.
- **Visuals:** Sprite MUST be a Blue Circular Sprite (`0x0000FF` or `0x00BFFF`).

### Requirement: Firing Logic
The weapon MUST fire projectiles towards the nearest enemy with spread.

#### Scenario: Spawn Mechanics
- **Targeting:** Find nearest enemy to player.
- **Spread:** If `count > 1`, apply a small spread (e.g., -10, +10 degrees) centered on the target vector.
- **Fallback:** If no target, fire in random forward arc or player facing direction.

### Requirement: Collision Effects
Projectiles MUST handle pierce and immunity correctly.

#### Scenario: On Hit
- **Pierce:** Decrement pierce count. Destroy projectile if pierce < 0.
- **Immunity:** Do not hit the same enemy twice (use `hitList`).
- **Damage Falloff:** Damage MUST decrease by 25% for each subsequent enemy hit (compounding or flat, e.g., 100% -> 75% -> 56%).
- **Effect:** Deal Damage and apply small Knockback (50).
