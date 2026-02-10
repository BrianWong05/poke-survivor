## Context

The current `LevelEditor` allows users to select only a single tile from the tileset. This makes placing large objects or groups of tiles repetitive. The underlying `selection` state in `LevelEditor` already supports `width` and `height`, but the UI in `EditorSidebar` only exposes single-tile selection via click.

## Goals / Non-Goals

**Goals:**
- Provide a drag-to-select interface on the tileset image.
- Visual feedback of the selection area while dragging.
- Support selecting rectangular regions of any size within the tileset bounds.

**Non-Goals:**
- Multi-selection of non-contiguous tiles (e.g., cmd+click).
- Selecting tiles across different tileset images (only one active tileset at a time).

## Decisions

**Interaction Model:**
- **Mouse Down**: Start a new selection. clear previous selection. Record the start tile coordinates (anchor).
- **Mouse Drag**: Update the selection to the rectangle formed by the anchor tile and the current tile under the cursor. This provides immediate visual feedback using the existing selection highlight.
- **Mouse Up**: Finalize the selection (effectively already done by the last drag update).

**State Management:**
- `EditorSidebar` will maintain transient state for the drag operation: `isSelecting` (boolean) and `selectionStart` ({x, y}).
- The actual `selection` state remains in `LevelEditor` and is updated via `onPaletteSelection`. This ensures the parent component always has the current valid selection for painting.

**Coordinate Calculation:**
- The selection rectangle `x, y, w, h` will be normalized such that `x, y` is always the top-left corner, and `w, h` are always positive.
- Example: If dragging from (2, 2) to (0, 0), the selection will be `x:0, y:0, w:3, h:3`.

## Risks / Trade-offs

- **Performance**: Updating the parent state on every mouse move (during drag) triggers re-renders. Given the simplicity of the sidebar and canvas, this should be performant enough. If lag is noticed, we could throttle the updates or use a local selection state that only commits to parent on mouse up, but real-time feedback is preferred for this feature.
