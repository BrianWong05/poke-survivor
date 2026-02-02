# enemy-stats Specification

## Purpose
TBD - created by archiving change redesign-enemy-damage. Update Purpose after archive.
## Requirements
### Requirement: Enemy Base Damage
Enemies MUST have a configurable damage stat that defaults to **1**.

#### Scenario: Default Damage
Given I am designing a new enemy type
When I do not specify a damage value
Then the damage should default to 1

#### Scenario: Damage in Stats
Given `ENEMY_STATS` configuration
When I inspect the stats for 'rattata', 'geodude', or 'zubat'
Then I should see a `damage` property set to 1

### Requirement: Damage Application
The combat system MUST apply damage rapidly (approximately every 100ms) while in contact.

#### Scenario: Contiuous Contact
Given the player is touching an enemy
When the collision occurs
Then the player should take 1 damage
And the player should become invulnerable for only 100ms
And the player should take another 1 damage after 100ms if still touching

### Requirement: Enemy Base HP
Enemies MUST have base Health Points (HP) defined in the configuration, which serve as the foundation for dynamic scaling.

#### Scenario: Rattata Durability
- **WHEN** a Rattata spawns
- **THEN** its Base Max HP MUST be at least **30** before scaling

#### Scenario: Geodude Durability
- **WHEN** a Geodude spawns
- **THEN** its Base Max HP MUST be at least **150** before scaling

#### Scenario: Zubat Durability
- **WHEN** a Zubat spawns
- **THEN** its Base Max HP MUST be at least **15** before scaling


