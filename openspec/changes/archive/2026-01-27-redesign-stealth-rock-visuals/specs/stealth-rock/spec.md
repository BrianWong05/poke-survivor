# Stealth Rock Visual Redesign

## ADDED Requirements

### Requirement: Custom Rock Visuals
The system SHALL display projectiles as jagged, rocky shapes.

#### Scenario: Jagged Texture
- **Given** the weapon spawns a projectile
- **Then** it uses a "jagged rock" texture (not a perfect circle)
- **And** it rotates slowly (tumbling effect) to simulate 3D floating rocks
- **And** it has random initial rotation for variety

## MODIFIED Requirements

### Requirement: Stealth Rock Stats & Progression
The system SHALL update the stats to ensure sufficient coverage.

#### Scenario: Progression
- **Given** the weapon upgrade path
- **Then** Level 1: Count 2, Speed 100
- **And** Level 4: Speed +10
- **And** Level 5: Count +1 (Total 3)
- **And** Level 6: Speed +10
- **And** Level 7: Count +1 (Total 4)
- **And** Level 8: Count +1 (Total 5)

### Requirement: Heavy Hit Logic
The system SHALL ensure visual weight matches the mechanical weight.

#### Scenario: Visual Weight
- **Given** the projectile moves
- **Then** it moves slowly
- **And** its tumbling animation is slow (heavy feeling)
