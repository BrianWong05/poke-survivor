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
The weapon SHALL behave as a slow, single-target launcher.

#### Scenario: Ember Firing
- **WHEN** Ember fires (Cooldown 1200ms)
- **THEN** spawn 1 `Fireball` at the nearest enemy
- **AND** Damage = 10
- **AND** Pierce = 0

### Requirement: Flamethrower (Level 8+)
The weapon SHALL behave as a rapid-fire stream.

#### Scenario: Flamethrower Evolution
- **WHEN** Weapon Level >= 8
- **THEN** Name changes to "Flamethrower"
- **AND** Cooldown becomes 150ms
- **AND** Damage becomes 6
- **AND** Pierce becomes 3
- **AND** Projectile tint becomes Orange (`0xFFA500`)

