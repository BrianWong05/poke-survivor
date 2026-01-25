# enemy-system Specification

## Purpose
Defines a scalable, class-based enemy system with multiple enemy variants, unique AI behaviors, and wave-based spawning with object pooling for performance.

## ADDED Requirements

### Requirement: Enemy Base Class
The system SHALL provide a base `Enemy` class extending `Phaser.Physics.Arcade.Sprite` that encapsulates health, damage, movement, and death behavior.

#### Scenario: Enemy initialization
- **WHEN** an Enemy is created or recycled from the pool
- **THEN** the Enemy has an `hp` property set to its configured max HP
- **AND** the Enemy has a `target` property referencing the player sprite
- **AND** the Enemy is active and visible

#### Scenario: Enemy takes damage
- **WHEN** `takeDamage(amount)` is called on an Enemy
- **THEN** the Enemy's `hp` is reduced by `amount`
- **AND** the Enemy flashes white (`setTint(0xffffff)`) for 100ms
- **AND** if `hp <= 0`, the Enemy dies

#### Scenario: Enemy death
- **WHEN** an Enemy's HP reaches zero or below
- **THEN** a fade-out tween plays (alpha 0 over 200ms)
- **AND** an `enemy:death` event is emitted with `(x, y, enemyType)`
- **AND** the Enemy is deactivated and returned to the pool

#### Scenario: Enemy movement toward target
- **WHEN** `preUpdate()` is called each frame
- **AND** the Enemy is active
- **THEN** the Enemy moves toward its `target` at its configured `speed`
- **AND** the Enemy's `flipX` is set based on horizontal velocity (faces the direction of movement)

---

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
