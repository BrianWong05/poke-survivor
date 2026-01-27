# Aura Sphere Spec Delta

## MODIFIED Requirements

### Requirement: Homing Behavior
Projectiles MUST actively steer towards targets during flight.

#### Scenario: Flight Logic
- **Targeting:** In `update()`, identify the nearest enemy to the *projectile* (not the player).
- **Steering:** Calculate angle difference between current velocity and angle to enemy.
- **Rotation:** Rotate velocity vector by `turnRate * delta` towards the enemy.
- **Visuals:** Sprite MUST be a complex "Energy Sphere" with:
    -   **Core:** Bright white/cyan center.
    -   **Glow:** Cyan/Electric Blue body with soft edges.
    -   **Swirls:** Visible energy strands or rings.
    -   **Animation:** Use rotation or pulsing to simulate volatile energy.
    -   **Trail:** A particle trail following the projectile path.
