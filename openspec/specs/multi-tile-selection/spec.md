# Multi-Tile Selection

## Requirement: Drag Selection on Tileset
Users must be able to select a rectangular group of tiles from the active tileset by clicking and dragging.

### Scenario: Selecting a range
- **WHEN** the user presses the primary mouse button on a tile in the tileset view
- **AND** drags the cursor to a different tile
- **THEN** the selection state should visually update to encompass the rectangular area defined by the start tile and the current tile
- **AND** the selection rectangle should be normalized (width and height always positive)

### Scenario: Committing selection
- **WHEN** the user releases the mouse button after dragging
- **THEN** the global editor selection state should be updated to the final calculated rectangle `(x, y, w, h)`
- **AND** subsequent painting tools (brush, fill) should use this multi-tile selection

## Requirement: Visual Feedback
The editor must provide real-time visual feedback of the selection area during the drag operation.

### Scenario: Highlighting selection
- **WHEN** the user is dragging to select tiles
- **THEN** a border or highlight overlay should appear over all tiles within the current selection bounds
- **AND** this highlight should update immediately as the mouse moves across tiles
