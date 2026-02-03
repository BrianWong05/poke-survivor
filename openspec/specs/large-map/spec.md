# Large Map

The large map provides a vastly expanded explorable area for the player, replacing the single-screen environment.

## Requirements

### Requirement: World size is 3200x3200 pixels
The game world SHALL have dimensions of 3200x3200 pixels, providing approximately 4x4 screens of explorable area.

#### Scenario: World initialization
- **WHEN** the MainScene creates
- **THEN** the physics world bounds SHALL be set to 3200x3200 pixels

### Requirement: Physics bounds contain player
The physics world bounds SHALL prevent the player from walking off the map edges.

#### Scenario: Player at world boundary
- **WHEN** the player attempts to move beyond the world bounds (0, 0, 3200, 3200)
- **THEN** the physics system SHALL block the player from exiting the bounds

### Requirement: Procedural grid background
The scene SHALL generate a procedural grid-pattern texture to indicate movement visually.

#### Scenario: Grid texture creation
- **WHEN** the scene initializes
- **THEN** a 64x64 pixel texture SHALL be generated with:
  - Forest green (0x228b22) fill
  - Dark green (0x006400) border lines

#### Scenario: Background covers entire world
- **WHEN** the background is rendered
- **THEN** a TileSprite SHALL display the grid texture across the full 3200x3200 world area

### Requirement: Player spawns at world center
The player SHALL spawn at the center of the world (1600, 1600) to allow exploration in all directions.

#### Scenario: Initial player position
- **WHEN** the scene starts
- **THEN** the player sprite SHALL be positioned at coordinates (1600, 1600)
