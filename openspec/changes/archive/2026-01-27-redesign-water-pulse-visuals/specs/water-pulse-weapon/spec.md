# Spec: Water Pulse Weapon

## MODIFIED Requirements

### Requirement: Projectile Behavior
The `WaterPulseShot` visuals MUST be updated to represent a "pulse" of water.

#### Scenario: Visual Texture
- **WHEN** the projectile texture is generated
- **THEN** it MUST be a **hollow ring** (stroked circle) instead of a solid dot.
- **AND** the stroke thickness should be visible (e.g., 2-3px).
- **AND** the color should remain Cyan (`0x00FFFF`) or similar.
