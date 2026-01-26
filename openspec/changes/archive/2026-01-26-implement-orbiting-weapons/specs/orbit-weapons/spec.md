# Orbit Weapons Specification

## ADDED Requirements

### Requirement: Flame Wheel (Fire)
The system SHALL implement "Flame Wheel" using the orbit system.

#### Scenario: Flame Wheel activation
- **WHEN** activated
- **THEN** it spawns red projectiles
- **AND** they spin fast
- **AND** they apply a "burn" status effect

### Requirement: Fire Spin (Evolution)
The system SHALL implement "Fire Spin" as the evolution of Flame Wheel.

#### Scenario: Fire Spin activation
- **WHEN** activated (Level 8 evolution)
- **THEN** it spawns permanent projectiles that never expire
- **AND** they have increased damage/speed

### Requirement: Aqua Ring (Water)
The system SHALL implement "Aqua Ring" using the orbit system.

#### Scenario: Aqua Ring activation
- **WHEN** activated
- **THEN** it spawns blue projectiles with slow spin
- **AND** they deal high knockback

### Requirement: Hydro Ring (Evolution)
The system SHALL implement "Hydro Ring" as the evolution of Aqua Ring.

#### Scenario: Hydro Ring activation
- **WHEN** activated
- **THEN** the radius and knockback are doubled

### Requirement: Magical Leaf (Grass)
The system SHALL implement "Magical Leaf" using the orbit system.

#### Scenario: Magical Leaf activation
- **WHEN** activated
- **THEN** it spawns green projectiles with medium spin
- **AND** they have high pierce value

### Requirement: Leaf Storm (Evolution)
The system SHALL implement "Leaf Storm" as the evolution of Magical Leaf.

#### Scenario: Leaf Storm activation
- **WHEN** activated
- **THEN** it spawns two rings of projectiles (inner and outer)

### Requirement: Compatibility Filter
The system SHALL provide a method to check compatibility.

#### Scenario: Checking type compatibility
- **WHEN** `OrbitWeapon.isCompatible` is called with a Pokemon type and Move element
- **THEN** it returns true if they match (e.g. Fire Pokemon learning Fire move)
