# damage-logic Specification

## Purpose
TBD - created by archiving change refine-damage-formula. Update Purpose after archive.
## Requirements
### Requirement: New Damage Formula MUST Allow Fractional Damage
The damage calculation MUST allow mitigated damage to fall below 1, using the formula `final = amount * (1 / (1 + defense * 0.1))`.
#### Scenario: Low Damage vs High Defense
- **Given** an enemy deals 1 damage
- **And** the player has 10 Defense
- **When** the player takes damage
- **Then** the mitigation factor should be 0.5 (1 / (1 + 1))
- **And** the final damage taken should be 0.5.

#### Scenario: High Damage vs Low Defense
- **Given** an enemy deals 10 damage
- **And** the player has 10 Defense
- **When** the player takes damage
- **Then** the mitigation factor should be 0.5
- **And** the final damage taken should be 5 (10 * 0.5).

#### Scenario: High Damage vs High Defense
- **Given** an enemy deals 100 damage
- **And** the player has 90 Defense
- **When** the player takes damage
- **Then** the mitigation factor should be 0.1 (1 / (1 + 9))
- **And** the final damage taken should be 10.

#### Scenario: Fractional Health Tracking
- **Given** the player takes 0.5 damage
- **When** the hp-update event is emitted
- **Then** the value should be rounded up (Math.ceil) to the nearest integer.

