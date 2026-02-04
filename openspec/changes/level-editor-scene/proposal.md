## Why

Currently, maps must be hardcoded or generated procedurally with limited control. Adding an in-game **Level Editor** (similar to RPG Maker XP) enables rapid, visual map creation by selecting tiles from a palette and painting them onto a canvas. This accelerates level design iteration and opens possibilities for user-created content.

## What Changes

- **New Scene**: Add `LevelEditorScene.ts` as a dedicated scene for tile-based map editing.
- **Split-Screen UI**: Implement a left palette (25% width, scrollable) showing the full tileset and a right map canvas (75% width, scrollable with WASD/right-click drag).
- **Tile Selection**: Click on the palette to select a tile (highlighted with a red box).
- **Painting**: Click or drag on the map canvas to place the selected tile at grid positions.
- **Multi-Layer Editing**: Support Ground (layer 0) and Objects/Collision (layer 1) with keyboard shortcuts (1/2) to switch.
- **Play Mode**: Press 'P' to export the current map data and launch `GameScene` for playtesting.
- **Camera System**: Dual cameras for palette and map views with proper bounds and ignore lists.

## Capabilities

### New Capabilities

- `level-editor`: Core tile-based level editing system including split-screen layout, tile palette, multi-layer painting, and export-to-play functionality.

### Modified Capabilities

*(None — this is a standalone new feature with no changes to existing spec requirements.)*

## Impact

- **New File**: `src/game/scenes/LevelEditorScene.ts`
- **Asset Dependency**: Requires `assets/tileset.png` (already used in the game)
- **Scene Integration**: Needs to pass custom map data to `GameScene` when transitioning
- **Preloader**: May need to ensure tileset is loaded before entering editor
