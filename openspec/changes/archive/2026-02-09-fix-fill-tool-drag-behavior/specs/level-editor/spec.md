## ADDED Requirements

### Requirement: Continuous Dragging
User interactions that involve dragging (Filling, Brushing, Erasing) must maintain their active state even if the cursor leaves the canvas boundaries.

#### Scenario: Dragging Outside Canvas
- **WHEN** user initiates a drag operation (mousedown) inside the canvas
- **AND** moves the cursor outside the canvas element
- **THEN** the drag operation continues to track mouse movement relative to the initial click or current position
- **AND** the operation is NOT cancelled or committed automatically

### Requirement: Explicit Commit
Drag-based operations must only be finalized when the user explicitly releases the mouse button.

#### Scenario: Releasing Mouse Outside
- **WHEN** user releases the mouse button while the cursor is outside the canvas
- **THEN** the current operation is committed (e.g., area filled, tiles painted)
- **AND** the drag state is reset

#### Scenario: Re-entering Canvas
- **WHEN** user moves cursor out of and back into the canvas during a drag
- **THEN** the operation continues seamlessly without interruption
