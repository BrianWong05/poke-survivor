# Petal Dance Specification

## ADDED Requirements

### Requirement: Petal Dance Stats & Progression
The system SHALL implement the `Petal Dance` weapon.

#### Scenario: Level 1 Stats
- **Given** the weapon is Level 1
- **Then** Dmg: 5 (Low)
- **And** Count: 4 (High)
- **And** Speed: 250 (Fast)
- **And** Radius: 90
- **And** Duration: 3000ms

#### Scenario: Progression
- **Then** it prioritizes Count and Speed upgrades
- **And** Level 8 has Infinite Duration

### Requirement: Grinder Logic
The system SHALL hit frequently.

#### Scenario: Hit Frequency
- **Then** the immunity timer per enemy should be low (or rely on high projectile count to hit often)
