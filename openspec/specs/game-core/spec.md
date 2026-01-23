# game-core Specification

## Purpose
TBD - created by archiving change create-survivor-prototype. Update Purpose after archive.
## Requirements
### Requirement: Player Auto-Attack
The system SHALL automatically fire a projectile at the nearest enemy within range at a fixed interval.

#### Scenario: Auto-fire at nearest enemy
- **WHEN** at least one enemy is within firing range
- **AND** the fire cooldown (1 second) has elapsed
- **THEN** a projectile is created and moves toward the nearest enemy

#### Scenario: No enemies in range
- **WHEN** no enemies are within firing range
- **THEN** no projectile is fired

---

### Requirement: Enemy Wave Spawning
The system SHALL continuously spawn enemies at the edges of the visible play area.

#### Scenario: Enemy spawns at screen edge
- **WHEN** the spawn timer interval elapses
- **THEN** a new enemy is spawned at a random position along the screen edge
- **AND** the enemy moves toward the player's current position

#### Scenario: Enemy reaches player
- **WHEN** an enemy collides with the player
- **THEN** the player takes damage
- **AND** the enemy is destroyed

---

### Requirement: Projectile-Enemy Collision
The system SHALL destroy both the projectile and the enemy when they collide.

#### Scenario: Projectile hits enemy
- **WHEN** a projectile overlaps with an enemy
- **THEN** the projectile is destroyed
- **AND** the enemy is destroyed
- **AND** an XP gem is spawned at the enemy's position

---

### Requirement: XP Collection Economy
The system SHALL allow the player to collect XP gems to increase their score.

#### Scenario: Player collects XP gem
- **WHEN** the player overlaps with an XP gem
- **THEN** the XP gem is destroyed
- **AND** the score increases by the gem's value

---

### Requirement: Player Health System
The system SHALL track player health and end the game when health reaches zero.

#### Scenario: Player takes damage
- **WHEN** an enemy collides with the player
- **THEN** the player's HP is reduced
- **AND** a brief invincibility period is granted

#### Scenario: Player dies
- **WHEN** player HP reaches 0
- **THEN** the game transitions to a game-over state

---

### Requirement: Placeholder Graphics
The system SHALL use programmatically generated placeholder graphics for all game entities.

#### Scenario: Graphics generation on scene load
- **WHEN** the main game scene is created
- **THEN** placeholder textures are generated:
  - Player: blue circle (32px diameter)
  - Enemy: red square (24px)
  - Projectile: white circle (8px)
  - XP Gem: yellow diamond (12px)

---

### Requirement: Entity Pooling
The system SHALL use object pooling for frequently spawned entities to maintain performance.

#### Scenario: Enemy spawning with pool
- **WHEN** a new enemy is needed
- **THEN** an inactive enemy from the pool is reused if available
- **OR** a new enemy is created if the pool is empty

#### Scenario: Entity destruction returns to pool
- **WHEN** an enemy, projectile, or XP gem is destroyed
- **THEN** the entity is deactivated and returned to its pool

