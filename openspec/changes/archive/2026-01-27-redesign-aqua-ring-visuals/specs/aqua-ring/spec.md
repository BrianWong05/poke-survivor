# Aqua Ring Redesign

## ADDED Requirements

### Requirement: Aqua Ring Visuals
The system SHALL display the Aqua Ring as multiple concentric rings with sparkle effects.

#### Scenario: Concentric Rings
- **Given** the weapon is active
- **Then** it spawns 3 concentric rings of projectiles (Inner, Middle, Outer) instead of a single ring
- **And** the "Inner" ring has radius ~80
- **And** the "Middle" ring has radius ~110
- **And** the "Outer" ring has radius ~140

#### Scenario: Sparkle Effects
- **When** the projectiles move
- **Then** they emit "sparkle" particles to create a shimmering effect

## MODIFIED Requirements

### Requirement: Aqua Ring Stats & Progression
The system SHALL update the stats to accommodate the new multi-ring structure.

#### Scenario: Level 1 Stats (Nerfed)
- **Given** the weapon is Level 1
- **Then** Dmg: 8 (Reduced from 12)
- **And** Count: 2 per ring (Creates gaps)
- **And** Speed: 150 (Reduced from 250)
- **And** Knockback: 150 (Reduced from 200, Gentle push)
- **And** Radius: 120 (Base)
- **And** Scale: 0.6 (Smaller sprites)
