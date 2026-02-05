## MODIFIED Requirements

### Requirement: Enemy Spawner System

#### Scenario: Spawn position
- **MODIFIED**:
- **WHEN** `spawn(playerX, playerY)` is called
- **THEN** the spawn position is a random point on a circle of radius ~600 centered on the player
- **AND** the coordinates SHALL be clamped to the actual physics world bounds
- **AND** the enemy appears outside the typical camera view
