# Will-O-Wisp Redesign

## ADDED Requirements

### Requirement: Ghostly Flame Visuals
The system SHALL display the Will-O-Wisp projectiles as burning ghostly fireballs with trails.

#### Scenario: Flame Trail
- **Given** the projectile is moving
- **Then** it MUST emit trail particles using the `will-o-wisp` texture
- **And** the particles MUST be tinted to match the "fire" aesthetic (e.g. BlueViolet)
- **And** the particles MUST be rendered behind (lower depth) than the main projectile

## MODIFIED Requirements

### Requirement: Will-O-Wisp Stats & Progression
The system SHALL configure the visual properties of the Will-O-Wisp.

#### Scenario: Visual Configuration
- **Given** the weapon is spawned
- **Then** Use texture 'will-o-wisp'
- **And** Scale: 0.7
- **And** Sprite rotation: Disabled (stays upright during orbit)
- **And** Depth: 100 (high priority)
