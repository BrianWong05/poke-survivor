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
The system SHALL delegate enemy spawning to the `EnemySpawner` system, which manages wave progression and object pooling.

#### Scenario: Enemy spawns at screen edge
- **WHEN** the `EnemySpawner` timer interval elapses
- **THEN** a new enemy is spawned at a random position on a circle of radius ~600 around the player (outside camera view)
- **AND** the enemy type is selected based on the current wave configuration
- **AND** the enemy moves toward the player's current position using its configured AI

#### Scenario: Enemy reaches player
- **WHEN** an enemy collides with the player
- **THEN** the player takes damage
- **AND** the enemy is destroyed (deactivated and returned to pool)

#### Scenario: Enemy spawner initialization
- **WHEN** the MainScene `create()` method is called
- **THEN** an `EnemySpawner` instance is created
- **AND** the spawner's enemy group is registered for collision with the player
- **AND** the spawner's enemy group is registered for collision with projectiles

### Requirement: Projectile-Enemy Collision
The system SHALL destroy both the projectile and the enemy when they collide.

#### Scenario: Projectile hits enemy
- **WHEN** a projectile overlaps with an enemy
- **THEN** the projectile is destroyed
- **AND** the enemy is destroyed
- **AND** an XP gem is spawned at the enemy's position

---

### Requirement: XP Collection Economy
The system SHALL allow the player to collect tiered XP gems with varying values and spawn probability.

#### Scenario: Player collects XP gem
- **WHEN** the player overlaps with an XP gem
- **THEN** the XP gem is destroyed
- **AND** the player gains XP equal to the gem's tier value (1, 10, 50, or 100)
- **AND** the ExperienceManager `addXP()` method is called with the tier value
- **AND** an `xp-update` event is emitted to React with current XP, max XP, and level

#### Scenario: Exp Candy drop on enemy death
- **WHEN** a regular enemy is destroyed
- **THEN** an Exp Candy is spawned at the enemy's position with the following probability:
  - 70% chance: EXP_CANDY_S (1 XP)
  - 20% chance: EXP_CANDY_M (10 XP)
  - 8% chance: EXP_CANDY_L (50 XP)
  - 2% chance: EXP_CANDY_XL (100 XP)

#### Scenario: Rare Candy drop on boss death
- **WHEN** a boss enemy is destroyed
- **THEN** a RARE_CANDY (200 XP) is spawned at the boss's position

#### Scenario: Exp Candy visual differentiation
- **WHEN** an Exp Candy is spawned
- **THEN** the candy's texture corresponds to its tier:
  - EXP_CANDY_S: Small yellow circle
  - EXP_CANDY_M: Medium orange circle
  - EXP_CANDY_L: Large red circle
  - EXP_CANDY_XL: Extra large purple circle
  - RARE_CANDY: Cyan square with glow effect

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
- **AND** all gameplay animations, physics, and tweens MUST stop immediately
- **AND** the Game Over UI is displayed

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
The system SHALL use object pooling for frequently spawned entities to maintain performance, including gem culling.

#### Scenario: Enemy spawning with pool
- **WHEN** a new enemy is needed
- **THEN** an inactive enemy from the pool is reused if available
- **OR** a new enemy is created if the pool is empty

#### Scenario: Entity destruction returns to pool
- **WHEN** an enemy, projectile, or XP gem is destroyed
- **THEN** the entity is deactivated and returned to its pool

#### Scenario: Gem count exceeds threshold
- **WHEN** the loot group contains more than 300 active gems
- **THEN** the 50 gems furthest from the player are destroyed
- **AND** performance is maintained at 60fps

---

### Requirement: Level Up Pause
The system SHALL pause the game scene when the player levels up.

#### Scenario: Level up triggers pause
- **WHEN** `ExperienceManager.addXP()` returns `true` (level up occurred)
- **THEN** `this.scene.pause()` is called
- **AND** "Level Up Menu Open" is logged to the console

#### Scenario: Game resumes after level up
- **WHEN** the level-up menu is dismissed (future implementation)
- **THEN** `this.scene.resume()` is called
- **AND** gameplay continues

