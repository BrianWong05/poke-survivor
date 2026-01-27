# psywave-weapon Specification

## Purpose
TBD - created by archiving change implement-psywave-weapon. Update Purpose after archive.
## Requirements
### Requirement: Psywave Stats & Progression
The system SHALL implement the `Psywave` weapon with the following level progression:

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **Then** Count: 1
- **And** Speed: 150 (Rotation Speed)
- **And** Duration: 3000ms
- **And** Cooldown: 4000ms
- **And** Radius: 100
- **And** Knockback: 100
- **And** Damage: 10

#### Scenario: Level Up Progression
- **Level 2:** Count +1 (Total 2)
- **Level 3:** Duration +1000ms (Total 4000ms)
- **Level 4:** Speed +50 (Total 200)
- **Level 5:** Count +1 (Total 3)
- **Level 6:** Duration +1000ms (Total 5000ms)
- **Level 7:** Count +1 (Total 4)
- **Level 8:** Duration becomes Infinite (Permanent)

### Requirement: Orbit Mechanics
The system SHALL implement `PsywaveShot` which orbits the player.

#### Scenario: Orbital Movement
- **When** the projectile updates
- **Then** its angle increases by `speed * (delta / 1000)`
- **And** its X position is `player.x + cos(angle) * radius`
- **And** its Y position is `player.y + sin(angle) * radius`
- **And** it maintains a reference to the player

### Requirement: Fire Orchestration
The system SHALL manage the spawning and cleanup of projectiles.

#### Scenario: Firing
- **When** `fire()` is called
- **Then** calculate start angles to evenly distribute projectiles (`360 / count`)
- **And** spawn projectiles at those angles

#### Scenario: Cleanup
- **When** `fire()` is called
- **And** existing projectiles are active
- **And** the weapon is NOT Level 8 (Infinite)
- **Then** destroy all existing projectiles before spawning new ones

### Requirement: Collision & Visuals
The system SHALL handle collisions and visuals.

#### Scenario: Visuals
- **Then** the sprite is a Purple Circle or Wave (`0x8A2BE2`)
- **And** (Optional) it leaves a faint trail

#### Scenario: Collision Immunity
- **When** a projectile overlaps an enemy
- **Then** it deals damage
- **And** it applies an immunity timer to that enemy (e.g., 0.5s) to prevent hitting every frame
- **And** it can hit the same enemy again after the timer expires

