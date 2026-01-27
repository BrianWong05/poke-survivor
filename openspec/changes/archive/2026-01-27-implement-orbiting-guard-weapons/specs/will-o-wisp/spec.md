# Will-O-Wisp Specification

## ADDED Requirements

### Requirement: Will-O-Wisp Stats & Progression
The system SHALL implement the `Will-O-Wisp` weapon.

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **Then** Dmg: 10
- **And** Count: 3
- **And** Speed: 180
- **And** Radius: 100
- **And** Duration: 3000ms

#### Scenario: Progression
- **Then** it follows standard progression up to Level 8
- **And** Level 8 has Infinite Duration

### Requirement: Burn Logic
The system SHALL apply burn status.

#### Scenario: On Hit
- **When** an enemy is hit
- **Then** roll for burn chance (e.g. 30%)
- **And** if successful, apply 'burn' status for 3000ms
