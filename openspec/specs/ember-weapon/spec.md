# ember-weapon Specification

## Purpose
Defines the technical requirements for Charmander's starting weapon (Ember) and its evolved rapid-fire form (Flamethrower).
## Requirements
### Requirement: Fireball Projectile
The system SHALL support a `Fireball` projectile with pierce capabilities.

#### Scenario: Fireball Creation
- **WHEN** a Fireball is spawned
- **THEN** it renders as a circle (Red by default)
- **AND** it moves at a constant speed (400)

#### Scenario: Fireball Collision
- **WHEN** fitting an enemy
- **THEN** deal damage
- **AND** decrement `pierce` count
- **IF** `pierce` count < 0
- **THEN** destroy the projectile

### Requirement: Ember (Level 1-7)
The weapon SHALL behave as a slow launcher that creates a hazard.

#### Scenario: Ember Firing
- **MODIFIED**:
- **WHEN** Ember fires
- **THEN** spawn 1 `Fireball`
- **AND** Damage = 8 (reduced from 10)

#### Scenario: Fireball Collision
- **ADDED**:
- **WHEN** Fireball hits an enemy or is destroyed
- **THEN** it SHALL spawn a `BurningGround` hazard at its location

### Requirement: Flamethrower (Level 8+)
The weapon SHALL behave as a rapid-fire stream.

#### Scenario: Flamethrower Evolution
- **WHEN** Weapon Level >= 8
- **THEN** Name changes to "Flamethrower"
- **AND** Cooldown becomes 150ms
- **AND** Damage becomes 6
- **AND** Pierce becomes 3
- **AND** Projectile tint becomes Orange (`0xFFA500`)

### Requirement: Burning Ground Hazard
The system SHALL implement a Burning Ground effect.

#### Scenario: Burning Ground properties
- **WHEN** spawned
- **THEN** it lasts for 3000ms
- **AND** it deals 3 damage every 500ms to enemies inside its area
- **AND** it renders as a flattened ellipse

