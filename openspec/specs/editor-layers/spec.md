# editor-layers Specification

## Purpose
The Editor Layers system provides dynamic layer management for the Level Editor, allowing users to create, configure, and organize multiple tile layers for richer map composition.

## Requirements

### Requirement: Layer Data Model
Each layer SHALL be represented as an object with a unique ID, user-defined name, a 2D tile grid, a visibility flag, and a collision flag.

#### Scenario: Default layer properties
- **WHEN** a new layer is created
- **THEN** the layer SHALL have a unique `id`, a default name (e.g., "Layer 3"), `visible` set to `true`, and `collision` set to `false`

#### Scenario: Layer tile grid dimensions
- **WHEN** a layer exists in a map of size W x H
- **THEN** the layer's tile grid SHALL have exactly H rows and W columns, each cell initialized to the empty tile

---

### Requirement: Add Layer
The editor SHALL allow the user to add a new layer to the map.

#### Scenario: Add layer via UI
- **WHEN** the user clicks the "Add Layer" button in the layer panel
- **THEN** a new layer SHALL be appended to the end of the layers list
- **AND** the new layer SHALL become the active editing layer

#### Scenario: Add layer tile grid
- **WHEN** a new layer is added to a map of size W x H
- **THEN** the new layer's tile grid SHALL be initialized as a W x H grid of empty tiles

---

### Requirement: Remove Layer
The editor SHALL allow the user to remove a layer from the map.

#### Scenario: Remove non-last layer
- **WHEN** the user clicks the delete button on a layer
- **AND** there are more than one layers in the map
- **THEN** the layer SHALL be removed from the layers list
- **AND** if the removed layer was the active layer, the active layer SHALL change to the nearest remaining layer

#### Scenario: Prevent removing last layer
- **WHEN** the user attempts to delete the only remaining layer
- **THEN** the system SHALL prevent the deletion
- **AND** the layer SHALL remain in the list

---

### Requirement: Rename Layer
The editor SHALL allow the user to rename a layer.

#### Scenario: Rename layer via double-click
- **WHEN** the user double-clicks the layer name in the layer panel
- **THEN** the name SHALL become an editable text input
- **AND** pressing Enter or clicking away SHALL confirm the new name

---

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

---

### Requirement: Layer Visibility Toggle
Each layer SHALL have a visibility toggle that controls whether it is rendered on the editor canvas.

#### Scenario: Hide a layer
- **WHEN** the user clicks the visibility icon on a visible layer
- **THEN** the layer SHALL stop rendering on the canvas
- **AND** the visibility icon SHALL indicate the hidden state

#### Scenario: Show a hidden layer
- **WHEN** the user clicks the visibility icon on a hidden layer
- **THEN** the layer SHALL resume rendering on the canvas
- **AND** the visibility icon SHALL indicate the visible state

#### Scenario: Paint on hidden layer
- **WHEN** the active layer is hidden
- **AND** the user paints on the canvas
- **THEN** the tile data SHALL still be modified on the active layer (painting is allowed on hidden layers)

---

### Requirement: Layer Collision Flag
Each layer SHALL have a collision flag that controls whether tiles on that layer generate collision in the game runtime.

#### Scenario: Toggle collision on
- **WHEN** the user enables collision on a layer
- **THEN** the layer's `collision` property SHALL be set to `true`

#### Scenario: Collision in game
- **WHEN** the game loads a map with a layer that has `collision` set to `true`
- **THEN** all non-empty tiles on that layer SHALL have collision enabled in the Phaser tilemap

---

### Requirement: Active Layer Selection
The editor SHALL allow the user to select which layer is the active editing target.

#### Scenario: Click to select layer
- **WHEN** the user clicks on a layer row in the layer panel
- **THEN** that layer SHALL become the active editing layer
- **AND** the layer row SHALL be visually highlighted

#### Scenario: Paint targets active layer
- **WHEN** the user paints on the canvas
- **THEN** tile changes SHALL only be applied to the active layer's tile grid

---

### Requirement: Layer Panel UI
The editor sidebar SHALL display a layer management panel.

#### Scenario: Layer panel contents
- **WHEN** the editor is active
- **THEN** the layer panel SHALL display all layers in their rendering order (bottom layer first or top layer first, consistent with visual stacking)
- **AND** each layer row SHALL show the layer name, a visibility toggle icon, and a delete button

#### Scenario: Active layer indicator
- **WHEN** a layer is the active editing layer
- **THEN** its row in the layer panel SHALL be visually distinguished (e.g., highlighted background)

---

### Requirement: Default Layers for New Maps
New maps SHALL start with two default layers that mirror the current Ground/Objects behavior.

#### Scenario: New map default layers
- **WHEN** a new map is created
- **THEN** the map SHALL have a layer named "Ground" with collision disabled as the first layer
- **AND** a layer named "Objects" with collision enabled as the second layer
- **AND** the "Ground" layer SHALL be the active editing layer

---

### Requirement: Backward-Compatible Map Loading
The editor SHALL load legacy maps that use the `ground`/`objects` format into the new layer system.

#### Scenario: Load legacy map
- **WHEN** a map file is loaded that has `ground` and `objects` fields but no `layers` field
- **THEN** the system SHALL create a "Ground" layer from the `ground` data with collision disabled
- **AND** create an "Objects" layer from the `objects` data with collision enabled

#### Scenario: Load new-format map
- **WHEN** a map file is loaded that has a `layers` field
- **THEN** the system SHALL use the `layers` data directly, ignoring `ground`/`objects` fields

---

### Requirement: Multi-Layer Serialization
The save system SHALL serialize all layers using the palette compression format.

#### Scenario: Save map with layers
- **WHEN** the user saves a map
- **THEN** the saved file SHALL include a `layers` array with each layer's id, name, compressed tile data, and collision flag
- **AND** the saved file SHALL also populate `ground` and `objects` from the first two layers for backward compatibility

---

### Requirement: Layer-Aware Undo/Redo
The undo/redo system SHALL capture the full state of all layers.

#### Scenario: Undo after painting
- **WHEN** the user paints on a layer and then triggers undo
- **THEN** the entire layers array SHALL revert to the state before the paint operation

#### Scenario: Undo after layer add/remove
- **WHEN** the user adds or removes a layer and then triggers undo
- **THEN** the layers array SHALL revert to include/exclude the added/removed layer

---

### Requirement: Layer-Aware Map Resize
When the map is resized, all layers SHALL be resized to match.

#### Scenario: Resize map with multiple layers
- **WHEN** the user resizes the map to new dimensions W x H
- **THEN** every layer's tile grid SHALL be resized to W x H
- **AND** existing tile data within the new bounds SHALL be preserved
