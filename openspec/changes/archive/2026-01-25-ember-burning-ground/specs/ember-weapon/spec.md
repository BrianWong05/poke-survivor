# Ember Update Specification

## Purpose
Update the Ember weapon to include the Burning Ground effect.

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Burning Ground Hazard
The system SHALL implement a Burning Ground effect.

#### Scenario: Burning Ground properties
- **WHEN** spawned
- **THEN** it lasts for 3000ms
- **AND** it deals 3 damage every 500ms to enemies inside its area
- **AND** it renders as a flattened ellipse
