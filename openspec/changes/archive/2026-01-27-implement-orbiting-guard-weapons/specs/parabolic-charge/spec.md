# Parabolic Charge Specification

## ADDED Requirements

### Requirement: Parabolic Charge Stats & Progression
The system SHALL implement the `Parabolic Charge` weapon.

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **Then** Dmg: 12
- **And** Count: 3
- **And** Speed: 180
- **And** Radius: 100
- **And** Duration: 3000ms

#### Scenario: Progression
- **Then** it follows standard progression up to Level 8
- **And** Level 8 has Infinite Duration

### Requirement: Heal Logic
The system SHALL heal the player.

#### Scenario: On Hit
- **When** an enemy is hit
- **Then** heal the player for 1 HP
