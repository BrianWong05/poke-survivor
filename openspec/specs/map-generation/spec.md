# Map Generation Spec

## Requirements

### Requirement: Map Initialization

#### Scenario: Create Grid
- **WHEN** `generateOutdoorMap` is called with width `W` and height `H`
- **THEN** A `W x H` grid is initialized with default grass tiles.

### Requirement: Terrain Features

#### Scenario: Water Generation
- **WHEN** Water generation is triggered
- **THEN** Randomly shaped lakes are placed on the map.
- **AND** Lakes are smoothed to remove single-tile irregularities.

#### Scenario: Dirt Patches
- **WHEN** Dirt generation is triggered
- **THEN** Random dirt patches are placed.
- **AND** Dirt patches do not overlap with water.

### Requirement: Path Generation

#### Scenario: Main Path
- **WHEN** Path generation is triggered
- **THEN** A continuous path is generated connecting different regions (using BSP or similar logic).
- **AND** The path avoids water bodies.
- **AND** The path is widened/thickened for gameplay.

### Requirement: Object Placement

#### Scenario: Tree Placement
- **WHEN** Object placement is triggered
- **THEN** Trees (Oak, Pine, Large) are randomly placed.
- **AND** Trees are not placed on water or paths.
- **AND** Multi-tile trees check for sufficient space.

### Requirement: Tile Resolution

#### Scenario: Auto-tiling
- **WHEN** Terrain generation is complete
- **THEN** Auto-tile logic is applied to Water, Dirt, and Path tiles to select the correct specific tile ID based on neighbors.
