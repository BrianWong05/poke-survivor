# ThunderShock Specification

## REMOVED Requirements

### Requirement: Weapon Firing Mechanics
The weapon SHALL automatically fire projectiles at the nearest enemy within range.

### Requirement: Projectile Behavior
The projectile SHALL deal damage and have a chance to inflict status effects on impact.

### Requirement: Evolution
The weapon SHALL upgrade to a stronger version upon reaching a specific character level.

## ADDED Requirements

### Requirement: Level-Based Stats
The weapon SHALL provide distinct stats for each level from 1 to 8.

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **When** the stats are retrieved
- **Then** Damage is 10
- **And** Bounces is 1 (Hits 2 total)
- **And** Jump Range is 250px
- **And** Cooldown is 1200ms

#### Scenario: Max Level Stats (Level 8)
- **Given** the weapon is Level 8
- **When** the stats are retrieved
- **Then** Damage is 20
- **And** Bounces is 6 (Hits 7 total)
- **And** Jump Range is 350px
- **And** Cooldown is 1000ms

### Requirement: Instant Chain Logic
The weapon SHALL instantly hit a chain of enemies upon firing.

#### Scenario: Chaining behavior
- **Given** a primary target is within range
- **When** the weapon fires
- **Then** the primary target takes damage
- **And** the chain seeks the next closest enemy within `jumpRange` of the *current* target
- **And** it excludes enemies already hit in this chain
- **And** it repeats until `bounces` are exhausted or no valid target is found

### Requirement: Visuals
The weapon SHALL display a jagged lightning bolt visual connecting hit targets.

#### Scenario: Drawing the bolt
- **Given** a chain of hits
- **When** the weapon fires
- **Then** a jagged line is drawn from the source (player/previous enemy) to the current enemy
- **And** the line has a Cyan outer glow and Yellow/White core
- **And** sparks are generated at the target position
- **And** the visuals fade out within 150ms
