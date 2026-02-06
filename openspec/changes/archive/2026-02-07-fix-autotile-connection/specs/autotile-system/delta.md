## ADDED Requirements

### Requirement: Inner Corner Intersection Rendering
The auto-tile system must capable of rendering proper intersections for cross paths using dedicated "Inner Corner" graphics where available, specifically distinguishing this case from the solid center block used for fully filled areas.

#### Scenario: Cross Path (Intersection)
- **WHEN** a tile is connected orthogonally (North, South, East, West) but is missing a diagonal neighbor (e.g., North-West)
- **THEN** only that specific quadrant should render as an "Inner Corner" using the isolated tile at `x:0, y:4` (Top-Right of Dirt.png), creating a concave corner effect instead of a solid fill.
