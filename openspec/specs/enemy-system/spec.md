# enemy-system Specification

## Purpose
TBD - created by archiving change add-enemy-system. Update Purpose after archive.
## Requirements
### Requirement: Enemy Base Class
The system SHALL provide a base `Enemy` class with enhanced visual feedback.

#### Scenario: Enemy initialization
- **MODIFIED**:
- **WHEN** an Enemy is created
- **THEN** the Enemy scale SHALL be set to **1.5**

#### Scenario: Enemy takes damage
- **MODIFIED**:
- **WHEN** `takeDamage(amount)` is called
- **THEN** the Enemy's `hp` is reduced by `amount`
- **AND** the Enemy SHALL flash solid white (`setTintFill(0xffffff)`) for 100ms
- **AND** the Enemy SHALL play an "Impact Pop" tween (squash and stretch)

### Requirement: Rattata Enemy Variant
The system SHALL provide a `Rattata` enemy class as fast, low-HP "chaff" that swarms the player.

#### Scenario: Rattata stats
- **GIVEN** a Rattata is spawned
- **THEN** it has speed 100 and max HP 10
- **AND** it uses a purple circle placeholder texture (if sprites unavailable)

#### Scenario: Rattata movement
- **WHEN** Rattata updates each frame
- **THEN** it moves directly toward the player using `moveToObject`

---

### Requirement: Geodude Enemy Variant
The system SHALL provide a `Geodude` enemy class as a slow, high-HP tank with knockback resistance.

#### Scenario: Geodude stats
- **GIVEN** a Geodude is spawned
- **THEN** it has speed 40, max HP 50, and mass 100
- **AND** it uses a grey circle placeholder texture (if sprites unavailable)

#### Scenario: Geodude knockback resistance
- **WHEN** Geodude collides with projectiles or other forces
- **THEN** it is minimally displaced due to its high physics mass

---

### Requirement: Zubat Enemy Variant
The system SHALL provide a `Zubat` enemy class as a fast rusher with evasive movement.

#### Scenario: Zubat stats
- **GIVEN** a Zubat is spawned
- **THEN** it has speed 140 and max HP 5
- **AND** it uses a blue circle placeholder texture (if sprites unavailable)

#### Scenario: Zubat sine-wave movement
- **WHEN** Zubat updates each frame
- **THEN** it moves toward the player with a perpendicular sine-wave offset
- **AND** the sine-wave has approximately 50px amplitude at ~200ms period

---

### Requirement: Enemy Spawner System
The system SHALL provide an `EnemySpawner` class that manages spawning, pooling, and wave progression.

#### Scenario: Object pooling
- **WHEN** an enemy needs to be spawned
- **THEN** the spawner retrieves an inactive enemy from the appropriate pool
- **OR** creates a new one if the pool is empty and under max size

#### Scenario: Spawn position
- **WHEN** `spawn(playerX, playerY)` is called
- **THEN** the spawn position is a random point on a circle of radius ~600 centered on the player
- **AND** the coordinates SHALL be clamped to the actual physics world bounds
- **AND** the enemy appears outside the typical camera view

#### Scenario: Wave difficulty progression
- **GIVEN** the elapsed game time
- **WHEN** time is 0-60 seconds
- **THEN** only Rattata spawns every 1000ms
- **WHEN** time is 60-120 seconds
- **THEN** Rattata and Zubat spawn every 500ms
- **WHEN** time exceeds 120 seconds
- **THEN** Rattata, Zubat, and Geodude spawn every 200ms

---

### Requirement: Enemy Placeholder Graphics
The system SHALL generate colored circle placeholders for each enemy type when sprites are unavailable.

#### Scenario: Placeholder texture generation
- **WHEN** the game scene initializes
- **THEN** the following textures are generated if not loaded from assets:
  - `enemy-rattata`: Purple circle (24px)
  - `enemy-geodude`: Grey circle (28px)
  - `enemy-zubat`: Blue circle (20px)

### Requirement: Enemy Tier Classification
Each enemy type SHALL be assigned a tier that determines its loot drop table.

#### Scenario: Enemy tier definitions
- **WHEN** `EnemyConfig` is imported
- **THEN** each enemy type includes a `tier` property from `EnemyTier` enum

#### Scenario: Existing enemy tier assignments
- **WHEN** enemies are spawned
- **THEN** the following tier mappings apply:
  - `Rattata` → `TIER_1`
  - `Geodude` → `TIER_2`
  - `Zubat` → `TIER_2`

---

### Requirement: EnemyTier Enum
The system SHALL define an `EnemyTier` enum for tier classification.

#### Scenario: EnemyTier values
- **WHEN** `EnemyTier` is imported
- **THEN** the following values are available:
  - `TIER_1`: Basic enemies (low HP, low reward)
  - `TIER_2`: Intermediate enemies (moderate HP, better reward chance)
  - `TIER_3`: Elite enemies (high HP, guaranteed better drops)
  - `TIER_4`: High Elite enemies (higher HP, mixed high rewards)
  - `TIER_5`: Mini-Boss enemies (very high HP, guaranteed high rewards)
  - `BOSS`: Boss enemies (very high HP, best drops)

### Requirement: Knockback State
The `Enemy` class MUST support a state where movement AI is suspended.

#### Scenario: Apply Knockback
  - When `applyKnockback(force, duration)` is called
  - Then `isKnockedBack` becomes true.
  - And the enemy velocity is set to the force vector.
  - And a timer is started to reset `isKnockedBack` to false after `duration`.

#### Scenario: Movement Loop
  - When `update` (or `preUpdate`) runs
  - And `isKnockedBack` is true
  - Then standard movement logic (moving towards player) is skipped.

