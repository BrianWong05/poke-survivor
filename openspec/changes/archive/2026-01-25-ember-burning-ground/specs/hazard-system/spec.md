# Hazard System Specification

## Purpose
Enable environmental effects that damage enemies over time in a controlled manner.

## ADDED Requirements

### Requirement: Hazard Damage Logic
The system SHALL support hazards that damage enemies at a specific interval.

#### Scenario: Hazard damages enemy periodically
- **WHEN** an enemy is overlapping with a hazard
- **AND** the current time is at least `hazard.tickRate` milliseconds after the enemy's `lastHazardHitTime`
- **THEN** the enemy SHALL take `hazard.damagePerTick` damage
- **AND** its `lastHazardHitTime` SHALL be updated to the current time
