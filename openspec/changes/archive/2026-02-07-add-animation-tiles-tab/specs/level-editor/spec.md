## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Split-Screen Layout
The Level Editor SHALL display a split-screen interface with a tile palette on the left (25% width) and a map canvas on the right (75% width).

#### Scenario: Initial layout render
- **WHEN** the Level Editor scene is launched
- **THEN** the screen SHALL be divided with the palette viewport on the left (25% of screen width) and the map canvas viewport on the right (75% of screen width)

#### Scenario: Palette displays active tab content
- **WHEN** the Level Editor scene is launched
- **THEN** the palette area SHALL display the content of the default tab (Tileset)
