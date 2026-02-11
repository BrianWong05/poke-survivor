## ADDED Requirements

### Requirement: Accurate Map Data Transfer
When the user initiates a "Play Test" from the Level Editor, the Game Scene must receive and render a map that is visually identical to the one in the editor.

#### Scenario: Multi-Layer Rendering
- **WHEN** a map with multiple layers (Ground, Objects, Decorations) is test-played
- **THEN** the Game Scene `MapManager` renders all layers in the correct order (Ground at bottom, Objects above).
- **AND** layer visibility and collision settings from the editor are respected.

#### Scenario: Tile ID Resolution
- **WHEN** the map uses tiles from various tilesets (e.g. `Outside.png`, `Interior.png`)
- **THEN** `MapManager` correctly resolves the tile IDs to the appropriate textures without scrambling or missing tiles.

#### Scenario: Object Depth Handling
- **WHEN** the player character moves around the map
- **THEN** the player sprite is rendered with appropriate depth relative to map layers (e.g., above ground, but potentially behind tall objects if Y-sorting is implemented, or at least consistently above all flat map layers).

### Requirement: Asset consistency
The game must load all assets available in the editor to ensuring they can be rendered.

#### Scenario: Tileset Loading
- **WHEN** the game preloads
- **THEN** it loads all tileset images from `src/assets/Tilesets` using their filenames as keys, matching the editor's asset naming convention.
