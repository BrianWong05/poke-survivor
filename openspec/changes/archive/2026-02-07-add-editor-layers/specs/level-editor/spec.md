## MODIFIED Requirements

### Requirement: Multi-Layer Editing
The editor SHALL support a dynamic collection of editable layers, each with configurable name, visibility, and collision properties.

#### Scenario: Default layer
- **WHEN** the Level Editor scene is launched with a new map
- **THEN** the "Ground" layer SHALL be the active editing layer

#### Scenario: Switch active layer
- **WHEN** the user clicks on a layer in the layer panel
- **THEN** that layer SHALL become the active editing layer
- **AND** the layer panel SHALL visually indicate the selected layer

#### Scenario: Layer indicator shows active layer name
- **WHEN** the Level Editor scene is active
- **THEN** the layer panel SHALL highlight the currently active layer by name

---

### Requirement: Layer Indicator UI
The editor SHALL display a layer management panel indicating which layer is currently being edited, with controls for managing all layers.

#### Scenario: Layer indicator visibility
- **WHEN** the Level Editor scene is active
- **THEN** a layer panel SHALL be visible in the sidebar showing all layers with the active layer highlighted

---

### Requirement: Export and Play
The user SHALL be able to export the current map and launch the game scene for playtesting.

#### Scenario: Press P to play
- **WHEN** the user presses the 'P' key or clicks "Play"
- **THEN** the system SHALL extract tile data from all layers
- **AND** the system SHALL start the GameScene passing the custom map data with the full layers array
