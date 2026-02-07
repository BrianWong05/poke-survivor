# level-editor Specification

## Purpose
The Level Editor allows users to create, modify, and manage custom tile-based maps for the game.
## Requirements
### Requirement: Palette Tabs
The palette SHALL provide tabs to switch between different tile sources (Tileset, Animations).

#### Scenario: Switch to Animation tab
- **WHEN** the user clicks the "Animations" tab
- **THEN** the palette view SHALL hide the standard tileset
- **AND** display the animation selection UI

#### Scenario: Switch to Tileset tab
- **WHEN** the user clicks the "Tiles" tab
- **THEN** the palette view SHALL hide the animation UI
- **AND** display the standard tileset image

---

### Requirement: Split-Screen Layout
The Level Editor SHALL display a split-screen interface with a tile palette on the left (25% width), a map canvas on the right (75% width), and zoom controls.

#### Scenario: Initial layout render
- **WHEN** the Level Editor scene is launched
- **THEN** the screen SHALL be divided with the palette viewport on the left (25% of screen width) and the map canvas viewport on the right (75% of screen width)
- **AND** zoom controls SHALL be visible

#### Scenario: Palette displays active tab content
- **WHEN** the Level Editor scene is launched
- **THEN** the palette area SHALL display the content of the default tab (Tileset)

---

### Requirement: Palette Scrolling
The palette SHALL be scrollable via mouse drag to navigate tall tilesets.

#### Scenario: Drag to scroll palette
- **WHEN** the user clicks and drags vertically within the palette area
- **THEN** the palette view SHALL scroll up or down based on drag direction

---

### Requirement: Map Canvas Scrolling
The map canvas SHALL be scrollable using arrow keys to pan across the editable map.

#### Scenario: Arrow key panning
- **WHEN** the user presses an arrow key (Up/Down/Left/Right) while the map canvas is focused
- **THEN** the map camera SHALL pan smoothly in the corresponding direction

---

### Requirement: Tile Selection
The user SHALL be able to select a tile from the palette by clicking on it.

#### Scenario: Click to select tile
- **WHEN** the user clicks on a tile in the palette
- **THEN** the system SHALL store that tile's ID as `selectedTileId`
- **AND** a red box marker SHALL be displayed over the selected tile in the palette

---

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

### Requirement: Mouse Position Marker
The editor SHALL display a marker on the map canvas showing the current tile position under the mouse.

#### Scenario: Marker follows mouse
- **WHEN** the user moves the mouse over the map canvas
- **THEN** a white outlined box marker SHALL be displayed at the grid-snapped tile position

---

### Requirement: Export and Play
The user SHALL be able to export the current map and launch the game scene for playtesting.

#### Scenario: Press P to play
- **WHEN** the user presses the 'P' key or clicks "Play"
- **THEN** the system SHALL extract tile data from all layers
- **AND** the system SHALL start the GameScene passing the custom map data with the full layers array

---

### Requirement: Blank Map Initialization
The editor SHALL create a blank tilemap of configurable size on scene creation.

#### Scenario: Default map size
- **WHEN** the Level Editor scene is launched
- **THEN** a blank 50x50 tile map SHALL be created with 32x32 pixel tiles

#### Scenario: Ground layer prefill
- **WHEN** the Level Editor scene is launched
- **THEN** the Ground layer SHALL be filled with tile ID 0 (default grass)

---

### Requirement: Camera Isolation
The palette camera and map camera SHALL be isolated so each only displays its own content.

#### Scenario: Palette camera ignores map
- **WHEN** the Level Editor scene is active
- **THEN** the palette camera SHALL NOT render the tilemap layers or map marker

#### Scenario: Map camera ignores palette
- **WHEN** the Level Editor scene is active
- **THEN** the map camera SHALL NOT render the palette image or palette marker

### Requirement: Save Map with Context
The Level Editor SHALL allow the user to save the current map using a custom UI that displays existing maps.

#### Scenario: Opening the Save Modal
- **WHEN** the user clicks the "Save" button
- **THEN** a modal SHALL appear showing a list of existing map names
- **AND** a text input SHALL be provided for the new map name

#### Scenario: Selecting existing map to overwrite
- **WHEN** the user clicks an existing map name in the Save Modal list
- **THEN** the map name SHALL be populated in the input field

#### Scenario: Overwrite confirmation
- **WHEN** the user attempts to save a map with a name that already exists
- **THEN** the system SHALL prompt for confirmation before proceeding with the save

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

