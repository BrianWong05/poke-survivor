## Why

Building maps with large objects (trees, buildings) or repeating patterns is tedious when selecting one tile at a time. Users need the ability to select a rectangular group of tiles from the tileset to paint them all at once. This significantly speeds up map creation and improves the workflow for placing composite objects.

## What Changes

The `LevelEditor`'s tileset selection logic will be updated to support drag-selection.

-   **Interaction**: Users will be able to click and drag on the tileset image to select a rectangular area of tiles.
-   **Visualization**: The selection highlight in the sidebar will update in real-time to show the area being selected.
-   **Logic**: The `EditorSidebar` component will track the start and current coordinates of the mouse drag to calculate the `x, y, w, h` of the selection.

## Capabilities

### New Capabilities

-   `multi-tile-selection`: Enable selecting a rectangular region of tiles in the tileset by clicking and dragging.

### Modified Capabilities

-   Empty.

## Impact

-   **Components**: `src/components/LevelEditor/components/EditorSidebar.tsx` will be the primary focus of changes.
-   **State**: The existing `selection` state in `LevelEditor` already supports `w` and `h` dimensions, so no major state refactoring is required, only the input handling needs to be enhanced.
