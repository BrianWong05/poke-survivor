## ADDED Requirements

### Requirement: Dynamic HP Scaling
The system SHALL calculate enemy Max HP at the moment of spawning based on the player's current level. The formula MUST be: `BaseHP * (1 + (PlayerLevel - 1) * 0.1)`.

#### Scenario: Level 1 HP Scaling
- **WHEN** an enemy spans and the player is Level 1
- **THEN** the enemy HP multiplier MUST be exactly 1.0x (Base HP)

#### Scenario: Level 11 HP Scaling
- **WHEN** an enemy spawns and the player is Level 11
- **THEN** the enemy HP multiplier MUST be exactly 2.0x (Base HP * 2)

#### Scenario: Level 41 HP Scaling
- **WHEN** an enemy spawns and the player is Level 41
- **THEN** the enemy HP multiplier MUST be exactly 5.0x (Base HP * 5)

### Requirement: Dynamic Damage Scaling
The system SHALL calculate enemy Damage at the moment of spawning based on the player's current level. The formula MUST be: `BaseDamage * (1 + (PlayerLevel - 1) * 0.05)`.

#### Scenario: Level 1 Damage Scaling
- **WHEN** an enemy spawns and the player is Level 1
- **THEN** the enemy Damage MUST be exactly the Base Damage (1.0x)

#### Scenario: Level 21 Damage Scaling
- **WHEN** an enemy spawns and the player is Level 21
- **THEN** the enemy Damage MUST be exactly 2.0x the Base Damage
