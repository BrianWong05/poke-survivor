## Why

The current mapping system lacks support for intelligent terrain generation. We need an RPG Maker XP Style Auto-Tile System to handle 47-tile variations (Corners, Edges, Inner Corners) to create smooth, connected terrain automatically based on neighbor adjacency.

## What Changes

We will implement a standard "Blob" tileset mapping system that:
1.  Converts neighbor states (N/NE/E/SE/S/SW/W/NW) into a single 0-46 Tile ID using bitmask logic.
2.  Generates the 47 needed tile variations by dynamically slicing and stitching a compact 3x3 tileset image at runtime.
3.  Automatically updates tile IDs on placement effectively "smoothing" the terrain.

Specific components:
- `AutoTileTable.ts`: Logic for neighbor bitmasking.
- `AutoTileGenerator.ts`: Runtime texture generation.
- `AutoTiler.ts`: Recursive placement logic.
- Integration into `Preloader` (to generating textures) and `Level Editor` (for placement).

## Capabilities

### New Capabilities
- `autotile-system`: The core logic for handling 47-tile auto-tiling, including generation, bitmasking, and recursive map updates.

### Modified Capabilities
<!-- None -->

## Impact

- `src/game/scenes/Preloader.ts`: Will be updated to generate tile textures on load.
- `src/game/scenes/LevelEditor.ts`: Will be updated to use `AutoTiler` on tile placement.
