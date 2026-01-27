# aqua-ring Specification

## Purpose
TBD - created by archiving change implement-orbiting-guard-weapons. Update Purpose after archive.
## Requirements
### Requirement: Aqua Ring Stats & Progression
The system SHALL implement the `Aqua Ring` weapon.

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **Then** Dmg: 8
- **And** Count: 2
- **And** Speed: 150
- **And** Radius: 110
- **And** Duration: 3000ms
- **And** Knockback: 150 (High)

#### Scenario: Progression
- **Then** it follows standard progression up to Level 8
- **And** Level 8 has Infinite Duration

### Requirement: Knockback Logic
The system SHALL push enemies away.

#### Scenario: On Hit
- **When** an enemy is hit
- **Then** apply a force vector away from the player center

