## MODIFIED Requirements

### Requirement: Split-Screen Layout
The Level Editor SHALL display a split-screen interface with a tile palette on the left (25% width), a map canvas on the right (75% width), and zoom controls.

#### Scenario: Initial layout render
- **WHEN** the Level Editor scene is launched
- **THEN** the screen SHALL be divided with the palette viewport on the left (25% of screen width) and the map canvas viewport on the right (75% of screen width)
- **AND** zoom controls SHALL be visible

#### Scenario: Palette displays active tab content
- **WHEN** the Level Editor scene is launched
- **THEN** the palette area SHALL display the content of the default tab (Tileset)
