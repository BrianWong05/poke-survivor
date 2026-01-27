# stealth-rock Specification

## Purpose
TBD - created by archiving change implement-orbiting-guard-weapons. Update Purpose after archive.
## Requirements
### Requirement: Stealth Rock Stats & Progression
The system SHALL implement the `Stealth Rock` weapon.

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **Then** Dmg: 25 (High)
- **And** Count: 2 (Low)
- **And** Speed: 100 (Slow)
- **And** Radius: 120
- **And** Duration: 4000ms

#### Scenario: Progression
- **Then** it prioritizes Damage upgrades
- **And** Level 8 has Infinite Duration

### Requirement: Heavy Hit Logic
The system SHALL deal heavy single hits.

#### Scenario: Visual Weight
- **Then** projectiles move slowly to simulate weight

