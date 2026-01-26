# ember-weapon Specification

## MODIFIED Requirements

### Requirement: Ember (Level 1-7)
The weapon SHALL behave as a projectile launcher with level-based progression.

#### Scenario: Level 1 Stats
- **MODIFIED**:
- **Given** Weapon Level is 1
- **When** the stats are retrieved
- **Then** Damage is 10
- **And** Count is 1
- **And** Pierce is 0
- **And** Speed is 400
- **And** Cooldown is 1200ms

#### Scenario: Level 2 Damage Increase
- **ADDED**:
- **When** Weapon Level is 2
- **Then** Damage is 15

#### Scenario: Level 3 Count Increase
- **ADDED**:
- **When** Weapon Level is 3
- **Then** Count is 2
- **And** Projectiles are fired in a 15-degree spread

#### Scenario: Level 4 Pierce Increase
- **ADDED**:
- **When** Weapon Level is 4
- **Then** Pierce is 1

#### Scenario: Level 5 Damage Increase
- **ADDED**:
- **When** Weapon Level is 5
- **Then** Damage is 20

#### Scenario: Level 6 Count Increase
- **ADDED**:
- **When** Weapon Level is 6
- **Then** Count is 3

#### Scenario: Level 7 Pierce Increase
- **ADDED**:
- **When** Weapon Level is 7
- **Then** Pierce is 2

#### Scenario: Level 8 Cooldown Reduction (Pre-Evolution)
- **ADDED**:
- **When** Weapon Level is 8
- **Then** Cooldown is 1000ms



## ADDED Requirements

### Requirement: Ember Spread Mechanics
The weapon SHALL fire multiple projectiles in a spread pattern when Count > 1.

#### Scenario: Spread Calculation
- **Given** a target direction (base angle) towards the closest enemy
- **And** a projectile Count > 1
- **When** firing
- **Then** the total spread angle is `(Count - 1) * 15` degrees
- **And** projectiles are distributed evenly with 15-degree increments centered on the base angle

#### Scenario: Projectile Speed Variance
- **When** firing projectiles (Spread or Single)
- **Then** the speed of each projectile is randomized between 0.9x and 1.1x of the base speed
