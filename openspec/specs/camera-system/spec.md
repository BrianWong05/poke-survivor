# Camera System

The camera system handles how the viewport follows the player and interacts with the game world.

## Requirements

### Requirement: Camera follows player
The camera SHALL follow the player sprite with smooth easing interpolation.

#### Scenario: Player moves and camera follows
- **WHEN** the player moves in any direction
- **THEN** the camera smoothly pans to keep the player centered in the viewport

#### Scenario: Camera uses lerp for smooth movement
- **WHEN** the camera follows the player
- **THEN** the camera uses a lerp factor of 0.1 for both X and Y axes to create smooth, non-jarring movement

### Requirement: Camera respects world bounds
The camera SHALL stop at the edges of the world and not show areas outside the defined world bounds.

#### Scenario: Player at world edge
- **WHEN** the player reaches the edge of the 3200x3200 world
- **THEN** the camera stops panning and does not display void areas beyond the world boundaries

#### Scenario: Camera bounds match world bounds
- **WHEN** the scene initializes
- **THEN** the camera bounds SHALL be set to (0, 0, mapWidth, mapHeight) where mapWidth and mapHeight equal 3200

### Requirement: Camera starts centered
The camera SHALL be centered on the player's spawn position at the start of the scene.

#### Scenario: Initial camera position
- **WHEN** the scene initialization is complete
- **THEN** the camera viewport center SHALL match the player's world position
- **AND** there SHALL be no visible panning from the world origin (0,0)
