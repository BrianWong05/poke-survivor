## MODIFIED Requirements

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
