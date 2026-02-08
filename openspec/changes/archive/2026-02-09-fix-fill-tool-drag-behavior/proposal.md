## Why

The current fill tool implementation in the Level Editor has a usability issue: if the user drags the mouse outside the canvas area while using the fill tool (or other drag-based tools), the operation is immediately cancelled or committed prematurely. This is frustrating for users who want to fill large areas extending to the edge of the visible map, as a slight slip of the mouse interrupts their workflow.

## What Changes

We will modify the `EditorCanvas` component to handle mouse events more robustly. Instead of relying on the canvas's `onMouseLeave` event to stop the drag, we will attach global event listeners (`mousemove`, `mouseup`) to the `window` object when a drag operation starts. These listeners will track the mouse movement even outside the canvas boundaries and ensure the operation is only committed when the user releases the mouse button.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->


### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `level-editor`: The interaction model for drag-based tools (fill, area eraser) will be updated to support off-canvas dragging.

## Impact

- **Code:** `src/components/LevelEditor/components/EditorCanvas.tsx`
- **User Experience:** Smoother and more forgiving interaction with the level editor tools.
