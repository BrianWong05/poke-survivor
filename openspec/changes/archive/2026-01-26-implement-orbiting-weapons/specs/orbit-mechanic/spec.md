# Orbit Mechanic Specification

## ADDED Requirements

### Requirement: Orbit Projectile Physics
The system SHALL implement `OrbitProjectile` which orbits a parent entity.

#### Scenario: Projectile orbits parent
- **WHEN** the `update` loop runs
- **THEN** the projectile's position is updated to `parent.x + cos(angle) * radius`, `parent.y + sin(angle) * radius`
- **AND** the angle increases by `speed * delta`
- **AND** the sprite rotates to face the tangent of the orbit

### Requirement: Generic Orbit Weapon Spawning
The system SHALL implement `OrbitWeapon` which spawns multiple projectiles.

#### Scenario: Spawning multiple projectiles
- **WHEN** the weapon fires
- **THEN** it spawns `projectileCount` number of projectiles
- **AND** they are evenly spaced around the circle (360 degrees / count)
- **AND** they persist for `duration` (unless permanent)

#### Scenario: Duration and Cooldown
- **WHEN** the duration expires
- **THEN** the projectiles are destroyed
- **AND** the weapon enters cooldown
