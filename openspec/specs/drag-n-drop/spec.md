# drag-n-drop Specification

## Purpose
Provides smooth drag-and-drop interactions for list reordering, specifically within the Level Editor's layer panel, using dnd-kit.

## Requirements

### Requirement: Drag Initiation
Users must be able to initiate a drag operation on any layer item in the list by clicking and holding.

#### Scenario: User starts dragging a layer
- **WHEN** the user presses and holds the left mouse button on a layer item
- **AND** moves the cursor beyond the drag threshold
- **THEN** the drag operation should start
- **AND** a semi-transparent drag overlay of the layer should appear attached to the cursor
- **AND** the original layer item in the list should dim or vanish to indicate it is being moved

### Requirement: List Reordering
The list must visually reorder in real-time as the user drags a layer over other items.

#### Scenario: User drags layer over another layer
- **WHEN** the user drags a layer item over another item in the list
- **THEN** the items should animate to make space for the dragged item at the new potential position
- **AND** the validation of the new position should be visually indicated (e.g., items shifting)

### Requirement: Drop Confirmation
Dropping the layer must confirm the new order and persist the change.

#### Scenario: User releases the dragged layer
- **WHEN** the user releases the mouse button while dragging
- **THEN** the drag overlay should animate to the final position in the list
- **AND** the list order should undergo a final update to reflect the change
- **AND** the actual layer data structure should be updated to reflect the new order

### Requirement: Drag Cancellation
Users must be able to cancel the drag operation.

#### Scenario: User presses Escape while dragging
- **WHEN** the user presses the 'Escape' key during a drag operation
- **THEN** the drag operation should be cancelled
- **AND** the layer should return to its original position without triggering any order updates
