# autotile-system Specification

## Purpose
The Auto-Tile System provides logic for runtime generation and identification of connected tile variations, ensuring smooth transitions and borders between tiles of the same type.

## Requirements

### Requirement: Auto-Tile Generation
The system must be able to generate 47 tile bitmask variations from a single 3x3 packed source texture at runtime.

#### Scenario: Runtime Generation
- **WHEN** the game preloads assets
- **THEN** it must slice the 3x3 source image into 47 distinct tile variations
- **AND** store them in a new texture key for use by the Tilemap.

### Requirement: Neighbor Bitmasking
The system must identify the correct tile variation based on the presence of neighboring tiles of the same type.

#### Scenario: Neighbor Analysis
- **WHEN** a tile is placed or updated
- **THEN** the system must check its 8 neighbors (cardinal and diagonal)
- **AND** calculate a bitmask value
- **AND** map that bitmask to one of the 47 generated tile indices.

### Requirement: Recursive Updates
Placing a tile updates the appearance of its neighbors to ensure smooth connections.

#### Scenario: Tile Placement
- **WHEN** a tile is placed at (x, y)
- **THEN** the system must recalculate the bitmask and update the tile index for the placed tile
- **AND** recursively update the 8 surrounding neighbors to reflect the new adjacency.

#### Scenario: Drag-Painting (Brush Tool)
- **WHEN** multiple tiles are placed by dragging the brush tool in the Level Editor
- **THEN** the system must recalculate the bitmask and update the tile index for every placed tile
- **AND** recursively update the 8 surrounding neighbors for each newly placed tile to ensure continuous connections.

### Requirement: Inner Corner Intersection Rendering
The auto-tile system must be capable of rendering proper intersections for cross paths using dedicated "Inner Corner" graphics where available, specifically distinguishing this case from the solid center block used for fully filled areas.

#### Scenario: Cross Path (Intersection)
- **WHEN** a tile is connected orthogonally (North, South, East, West) but is missing a diagonal neighbor (e.g., North-West)
- **THEN** only that specific quadrant should render as an "Inner Corner" (using the tile at `x:4, y:0` in Dirt.png), creating a concave corner effect instead of a solid fill.
