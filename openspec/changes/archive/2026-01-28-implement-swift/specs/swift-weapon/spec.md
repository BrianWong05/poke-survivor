# Swift Weapon Specification

## ADDED Requirements

### Requirement: Weapon Stats & Behavior
The Swift weapon SHALL utilize a directional parallel volley archetype affecting its stats and progression.

#### Scenario: Level 1 Stats
- **Given** the player has Swift Level 1
- **Then** it should fire 2 projectiles
- **And** damage should be 10
- **And** pierce should be 1
- **And** cooldown should be 1200ms
- **And** speed should be 800

### Requirement: Firing Logic
The weapon SHALL fire projectiles in the direction of player movement (360 degrees), or the last facing direction if stationary.

#### Scenario: 360 Degree Fire
- **Given** the player is moving with a specific velocity vector
- **When** the weapon fires
- **Then** projectiles should travel in the same direction as the velocity (360 degrees)
- **And** projectiles should maintain a perpendicular "wall" formation relative to that direction

#### Scenario: Stationary Fire
- **Given** the player is stationary
- **When** the weapon fires
- **Then** projectiles should travel in the approximate direction of the last facing direction (8-way)

#### Scenario: Parallel Volley ("Wall")
- **Given** the `count` is greater than 1
- **When** the weapon fires
- **Then** projectiles should be spawned in a vertical line centered on the player
- **And** vertical spacing should be 20px
- **And** they should all move in parallel

### Requirement: Projectile Behavior
The SwiftShot projectile SHALL have specific visual and collision properties distinct from other weapons.

#### Scenario: Visuals
- **When** a projectile is active
- **Then** it should spin (`angle` changes every frame)
- **And** it should be tinted Gold/Yellow (`0xFFD700`)

#### Scenario: Collision
- **When** hitting an enemy
- **Then** it should apply damage
- **And** it should apply knockback in the direction of travel
- **And** it should decrement pierce count
- **And** it should be destroyed if pierce < 0
