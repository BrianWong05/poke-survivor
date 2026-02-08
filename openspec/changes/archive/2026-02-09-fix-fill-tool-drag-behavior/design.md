## Context

The `EditorCanvas` component currently handles mouse interactions using event listeners attached directly to the `<canvas>` element. Specifically, `onMouseLeave` is bound to `handleMouseUp`, which causes any drag operation (like painting or filling) to terminate immediately if the cursor exits the canvas area. This behavior disrupts users who trying to fill areas near the edge of the map.

## Goals

- **Continuous Dragging:** Users must be able to continue a drag operation (painting, erasing, filling) even if their cursor moves outside the canvas boundaries.
- **Explicit Commit:** The action should only be finalized (committed) when the user releases the mouse button (`mouseup`), regardless of cursor position.
- **Robust Coordinate Handling:** Mouse coordinates should be correctly calculated relative to the canvas even when the mouse is outside it.

## Non-Goals

- **Touch Support:** This change focuses on mouse interactions. Touch support is out of scope for this specific fix.
- **Input System Refactor:** We will not be refactoring the entire input handling into a separate hook or system at this time, but rather fixing the specific issue within `EditorCanvas`.

## Decisions

### 1. Global Event Listeners
We will switch from canvas-bound `onMouseMove` and `onMouseUp` (during a drag) to `window`-bound event listeners.
- **Start:** `onMouseDown` on the canvas initiates the drag and attaches `mousemove` and `mouseup` listeners to `window`.
- **Update:** The `window` `mousemove` listener updates the drag state.
- **End:** The `window` `mouseup` listener commits the action and removes the global listeners.

### 2. Coordinate Clamping
When the mouse is outside the canvas, the coordinates will logically extend beyond the map bounds.
- For **Brush/Eraser**: We likely want to ignore updates or clamp to the edge if we want to support "painting at the edge" easily. However, simply ignoring out-of-bounds updates for brush strokes is safer to avoid accidental edits.
- For **Fill/Area Tools**: The selection rectangle needs to be defined by the start point and the current point. If the current point is outside, we should probably clamp it to the nearest valid tile index so the selection rect snaps to the edge of the map.

### 3. Removal of onMouseLeave
We will remove the `onMouseLeave={handleMouseUp}` prop from the canvas element entirely.

## Risks / Trade-offs

- **Event Leaks:** We must ensure that global event listeners are properly removed in all cases (mouseup, component unmount).
- **Performance:** Adding function references to window listeners on every drag is generally fine, but we should ensure we don't cause unnecessary re-renders. Using `useCallback` and refs properly will mitigate this.
