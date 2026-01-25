# hazard-system Specification

## Purpose
Defines the management and damage logic for environmental hazards that affect enemies.
## Requirements
### Requirement: Hazard Damage Logic
The system SHALL support hazards that damage enemies at a specific interval.

#### Scenario: Hazard damages enemy periodically
- **WHEN** an enemy is overlapping with a hazard
- **AND** the current time is at least `hazard.tickRate` milliseconds after the enemy's `lastHazardHitTime`
- **THEN** the enemy SHALL take `hazard.damagePerTick` damage
- **AND** its `lastHazardHitTime` SHALL be updated to the current time

