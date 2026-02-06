## 1. Implementation

- [x] 1.1 Update `AutoTileGenerator.ts`
    - Define `INNER_CORNER` in `SRC` constants (`x: 4, y: 0`).
    - Modify `drawQuad` logic to detect the "crossed but missing diagonal" case and render using `INNER_CORNER`.
    - Ensure logical branching correctly handles TL, TR, BL, BR quadrants for the single source tile.
- [x] 1.2 Fix `AutoTileTable.ts`
    - Remove the "Cross" override that forces index 16 to be solid.
- [x] 1.3 Fix `AutoTiler.ts`
    - Update `refreshSingleTile` to assume same-set connection only (using `_tileTypeIndex`). Ensure it doesn't connect to empty or disparate tiles.
- [x] 1.4 Fix `AutoTileGenerator.ts` Mapping
    - Invert quadrant mapping for `INNER_CORNER` (TL dest uses BR src, etc) to handle the "Hollow Box" source tile correctly.
- [x] 1.5 Fix `AutoTileGenerator.ts` Logic
    - Revert Inverted Mapping. Use standard quadrant offsets for `INNER_CORNER`; the source tile is already correctly oriented.


## 2. Verification

### Automated Tests
- This change is purely visual and relies on rendering context, so no unit tests are strictly applicable unless we mock the Phaser texture manager. We will rely on manual verification.

### Manual Verification
- **Run Game:** Use `npm run preview`.
- **Open Level Editor:** Navigate to the Level Editor (if accessible) or play the game.
- **Draw Cross:** Create a cross pattern (a + shape) with the Brush tool (using Dirt tileset).
- **Inspect Center:** Verify that the center tile of the cross renders with 4 concave "inner corners" meeting in the middle, forming a visually correct intersection.
- **Inspect Edges:** Verify that normal corners and edges still render correctly to ensure no regression.
