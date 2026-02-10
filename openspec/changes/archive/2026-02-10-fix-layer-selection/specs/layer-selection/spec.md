## ADDED Requirements

### Requirement: Layer Selection Handling

The system must distinguish between a click (to select) and a drag (to reorder) on layer items.

#### Scenario: User selects a layer
- **WHEN** the user presses and releases the pointer on a layer item without moving more than 8 pixels
- **THEN** the layer connected to that item must become the active layer
- **AND** the layer item must visually reflect the selected state

#### Scenario: User reorders a layer
- **WHEN** the user presses on a layer item and moves the pointer more than 8 pixels
- **THEN** the drag operation must initiate
- **AND** the layer item must not be selected solely by this action (unless the drag results in a selection change side-effect, which is not the primary intent)
