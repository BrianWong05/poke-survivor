# petal-dance Specification

## Purpose
TBD - created by archiving change implement-orbiting-guard-weapons. Update Purpose after archive.
## Requirements
### Requirement: Petal Dance Stats & Progression
The system SHALL update stats to support high-count swarms.

#### Scenario: Progression
- **Then** Count: High (starts at 4) to support density
- **And** Speed: High (250+)
- **And** Level 8: Infinite Duration + 4 Extra Count (Total 12) to create a dense storm

### Requirement: Grinder Logic
The system SHALL hit frequently.

#### Scenario: Hit Frequency
- **Then** the immunity timer per enemy should be low (or rely on high projectile count to hit often)

### Requirement: Custom Petal Visuals
The system SHALL display projectiles as petals.

#### Scenario: Petal Texture
- **Given** the weapon spawns a projectile
- **Then** it uses the "petal" sprite asset (pink teardrop shape)
- **And** it is tinted Pink by default
- **And** it spins/tumbles (self-rotation) independent of orbit

### Requirement: Swarm Formation
The system SHALL display a "dance" or swarm effect.

#### Scenario: Formation Variance
- **Given** multiple petals spawn
- **Then** they have slight radius/angle variance (not a perfect thin line)
- **And** they move rapidly to create a "storm" feel

