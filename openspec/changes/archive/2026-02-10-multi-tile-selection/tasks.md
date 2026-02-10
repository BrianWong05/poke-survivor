## 1. Frontend Implementation

- [x] 1.1 Update `EditorSidebar` to track mouse drag state (`isSelecting`, `startCoord`, `currentCoord`) for the tileset image.
- [x] 1.2 Implement coordinate calculation logic to normalize selection rectangle (ensure positive width/height).
- [x] 1.3 Update the visual highlight overlay in `EditorSidebar` to reflect the current drag selection in real-time.
- [x] 1.4 Commit the final selection to `LevelEditor`'s state on mouse up/drag end.

## 2. Verification

- [x] 2.1 Verify that clicking and dragging on the tileset selects the corresponding rectangular area.
- [x] 2.2 Verify that the selection highlight updates smoothly while dragging.
- [x] 2.3 Verify that painting with the brush tool uses the selected multi-tile pattern.
- [x] 2.4 Verify that single clicks still function correctly (select 1x1 tile).
