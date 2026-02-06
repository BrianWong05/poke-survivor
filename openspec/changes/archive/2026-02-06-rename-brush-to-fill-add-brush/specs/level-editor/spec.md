## ADDED Requirements

### Requirement: Fill Tool
The "Fill" tool SHALL allow smart or recursive tile placement (e.g., for Autotiles or Bucket fill).

#### Scenario: Painting with Fill Tool
- **WHEN** the "Fill" tool is active
- **AND** the user clicks on the map canvas
- **THEN** the system SHALL apply recursive or smart placement logic (e.g. Autotile expansion) starting from the clicked position

### Requirement: Tool Selection
The user SHALL be able to switch between Brush, Fill, Eraser, and Spawn tools.

#### Scenario: Selecting Fill Tool
- **WHEN** the user clicks the "Fill" button in the toolbar
- **THEN** the active tool SHALL become "Fill"

#### Scenario: Selecting Brush Tool
- **WHEN** the user clicks the "Brush" button in the toolbar
- **THEN** the active tool SHALL become "Brush"

## MODIFIED Requirements

### Requirement: Tile Painting
The "Brush" tool SHALL allow precise single-tile placement.

#### Scenario: Single click painting with Brush
- **WHEN** the "Brush" tool is active
- **AND** the user clicks on the map canvas
- **THEN** the `selectedTileId` SHALL be placed ONLY at the clicked grid position (ignoring recursive autoset logic)

#### Scenario: Drag painting with Brush
- **WHEN** the "Brush" tool is active
- **AND** the user clicks and drags
- **THEN** the `selectedTileId` SHALL be placed at each grid position the pointer passes over
