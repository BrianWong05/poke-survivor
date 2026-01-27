# water-pulse-weapon Specification

## Purpose
TBD - created by archiving change implement-water-pulse. Update Purpose after archive.
## Requirements
### Requirement: Weapon Configuration
The `WaterPulse` class MUST implement the `WeaponConfig` interface and define the specific progression stats.

#### Scenario: Initial Stats (Level 1)
  - When the weapon is Level 1
  - Then it has Damage 4, Count 1, Pierce 0, Speed 700, Cooldown 400ms, Knockback 150.

#### Scenario: Evolution (Level 8)
  - When the weapon reaches Level 8
  - Then the Cooldown drops to 200ms (Machine Gun mode) and Pierce is 2.

### Requirement: Projectile Behavior
The `WaterPulseShot` visuals MUST be updated to represent a "pulse" of water.

#### Scenario: Visual Texture
- **WHEN** the projectile texture is generated
- **THEN** it MUST be a **hollow ring** (stroked circle) instead of a solid dot.
- **AND** the stroke thickness should be visible (e.g., 2-3px).
- **AND** the color should remain Cyan (`0x00FFFF`) or similar.

