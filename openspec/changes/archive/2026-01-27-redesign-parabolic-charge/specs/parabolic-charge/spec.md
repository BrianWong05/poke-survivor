# Parabolic Charge Redesign

## ADDED Requirements

### Requirement: Electric Field Visuals
The system SHALL display the Parabolic Charge as an electric field surrounding the player.

#### Scenario: Pulsing Field
- **Given** the weapon is active
- **Then** it displays a large yellow circular field (Radius ~100-150)
- **And** the field pulses (using `electric-field` high-res texture)
- **And** it emits jagged "lightning" sparks

## MODIFIED Requirements

### Requirement: Parabolic Charge Stats & Progression
The system SHALL update the stats to reflect the field nature and balance.

#### Scenario: Field Configuration
- **Given** the weapon Level 1
- **Then** Damage: 8
- **And** Cooldown: 4500ms
- **And** Knockback: 50
- **And** Scale: 0.6 (high-res texture base)
- **And** Duration: 3000ms
- **And** Count: 1 (Persistent field)

#### Scenario: Level Progression
- **Given** the weapon levels up
- **Then** Level 2: +2 Damage
- **And** Level 3: +250ms Duration
- **And** Level 4: +10 Knockback, +0.1 Scale
- **And** Level 5: +5 Damage
- **And** Level 6: +250ms Duration, +0.1 Scale
- **And** Level 7: +5 Damage
- **And** Level 8: Infinite Duration
