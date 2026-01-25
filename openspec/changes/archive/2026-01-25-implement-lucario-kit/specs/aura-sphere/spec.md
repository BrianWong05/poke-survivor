# Weapon: Aura Sphere & Focus Blast

## ADDED Requirements

### Requirement: Aura Sphere (Level 1-7) MUST have specific behavior
The Aura Sphere weapon MUST behave as a homing projectile with specific stats in its initial levels.

#### Scenario: Visuals and stats
- Fires `AuraSphereProjectile` visuals (Blue Circle `0x00BFFF`).
- Projectiles MUST home in on the closest enemy with high turn rate.
- Projectile stats MUST be Damage 12, Pierce 2, Speed 400.

### Requirement: Weapon MUST evolve into Focus Blast at Level 8+
The weapon MUST transform into a more powerful, non-homing version at level 8.

#### Scenario: Evolution mechanics
- When player upgrades Aura Sphere to level 8, it MUST evolve into Focus Blast.
- Fires `FocusBlastProjectile` visuals (Orange/Red Sphere `0xFF4500`, Scale 2.5).
- Projectiles MUST NOT home in (straight line).
- Flight speed MUST be reduced to 200.

### Requirement: Focus Blast MUST explode on impact
Focus Blast projectiles MUST create an area-of-effect explosion upon hitting a target or expiring.

#### Scenario: Explosion logic
- When Focus Blast projectile hits an enemy or expires, an Explosion object MUST be spawned.
- Explosion MUST deal AOE damage.
- Explosion MUST have a 50% chance to be a Critical Hit (triggering Instakill on non-bosses).
