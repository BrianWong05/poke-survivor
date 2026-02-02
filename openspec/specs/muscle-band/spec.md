# muscle-band Specification

## Purpose
The Muscle Band is a passive item that increases the player's damage output (might).

## Requirements

### Requirement: Muscle Band Item
The system SHALL provide a "Muscle Band" passive item that increases the player's damage output.

#### Scenario: Level 1 Buff
- **WHEN** the player acquires Muscle Band Level 1
- **THEN** the player's `might` stat increases by 10% (multiplier +0.10)

#### Scenario: Max Level Buff
- **WHEN** the player upgrades Muscle Band to Level 5
- **THEN** the player's `might` stat increases by a total of 50% (multiplier +0.50)

### Requirement: Muscle Band Sprite
The system SHALL display the correct Muscle Band sprite in the inventory and level-up rewards.

#### Scenario: Visual Display
- **WHEN** Muscle Band is displayed
- **THEN** the sprite key `muscle_band` is used.
