## MODIFIED Requirements

### Requirement: Reorder Layers
The editor SHALL allow the user to change the rendering order of layers.

#### Scenario: Move layer up
- **WHEN** the user clicks the "move up" control on a layer that is not already first
- **THEN** the layer SHALL swap position with the layer above it
- **AND** the canvas SHALL re-render with the updated order

#### Scenario: Move layer down
- **WHEN** the user clicks the "move down" control on a layer that is not already last
- **THEN** the layer SHALL swap position with the layer below it
- **AND** the canvas SHALL re-render with the updated order

#### Scenario: Drag and drop layer
- **WHEN** the user drags a layer row and drops it at a new position in the list
- **THEN** the layer SHALL be moved to the target position
- **AND** the rendering order SHALL be updated accordingly
- **AND** the canvas SHALL re-render with the updated order
