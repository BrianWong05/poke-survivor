# game-core Specification (Delta)

## MODIFIED Requirements

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
