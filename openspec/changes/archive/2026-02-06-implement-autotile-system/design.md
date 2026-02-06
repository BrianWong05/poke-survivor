## Context

The `LevelEditor` is a standalone React component using HTML5 Canvas (`2d` context), distinct from the Phaser `MainScene`.
The original design assumed the Level Editor was a Phaser Scene. This was incorrect.
We need to implement the Auto-Tile generation and placement logic for the React environment alongside the Phaser environment.

## Goals

1.  **Phaser (Game):** Keep existing `AutoTileGenerator` and `AutoTiler` (implemented).
2.  **React (Editor):**
    -   Implement `generateAutoTileCanvas` (HTML Canvas version of the generator).
    -   Integrate `getAutoTileId` (AutoTileTable) into the editor's placement logic.
    -   Ensure the Editor displays the generated 47-tile texture, not the raw 3x3 source.

## Implementation Details

### 1. `src/game/utils/AutoTileTable.ts` (Shared)
- Already generic. Safe to use in React.

### 2. `src/components/LevelEditor/utils.ts` (New)
- **`generateAutoTileTexture(image: HTMLImageElement): HTMLCanvasElement`**
    - Copy logic from `AutoTileGenerator`, but use `ctx.drawImage` and `canvas`.
    - Output: A canvas element containing the 47 tiles (8 cols x 6 rows).
- **`updateAutoTileGrid(grid: TileData[][], x: number, y: number, ...)`**
    - Recursive update logic using `getAutoTileId`.
    - Updates the grid data in place or returns new grid.

### 3. `src/components/LevelEditor/index.tsx` (Update)
- **Asset Loading:**
    - Detect 'autoset' images.
    - Run them through `generateAutoTileTexture`.
    - Store the *generated* canvas in `imageCache` instead of the raw image.
- **Palette Interaction:**
    - If `activeTab === 'autoset'`, disable specific sub-tile selection (or just ignore it).
    - Always treat "Painting" with an autoset as "Calculate ID dynamicallly".
- **Placement Logic (`handleCanvasMouseUp`):**
    - If `activeTab === 'autoset'`, use `updateAutoTileGrid` to set the tile and update neighbors.
    - This replaces the simple `newGrid[y][x] = ...` assignment.

## Risks
- **Asset Key Mismatch:** The Phaser game loads "Dirt.png" as 'cave_raw' and generates 'cave_auto'. The Editor just uses filenames ("Dirt.png").
    - **Solution:** In the editor, simply overwrite the "Dirt.png" entry in `imageCache` with the generated version. The `drawTile` logic uses `tile.set` which is the filename. If `imageCache["Dirt.png"]` is the 47-tile version, it will work transparently as long as tile IDs are correct (0-46).
    - Logic: `autoset` tab tiles will have IDs 0-46. `tileset` tab tiles will use raw indices.

