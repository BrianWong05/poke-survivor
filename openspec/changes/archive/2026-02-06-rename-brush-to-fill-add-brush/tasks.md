## 1. Type & State Updates

- [x] 1.1 Update `activeTool` state definition in `src/components/LevelEditor/index.tsx` to include `'fill'`.
- [x] 1.2 Update any derived types or interfaces that reference the tool state.

## 2. UI Implementation

- [x] 2.1 Add a "Fill" button to the `LevelEditor` toolbar (next to Brush).
- [x] 2.2 Ensure the "Fill" button correctly sets `activeTool` to `'fill'`.
- [x] 2.3 Update the "Brush" button to strictly set `activeTool` to `'brush'`.
- [x] 2.4 Verify active state styling works for all buttons.

## 3. Logic Implementation

- [x] 3.1 Update `handleMouseDown` (or equivalent) in `LevelEditor/index.tsx` to handle `'fill'` tool logic (using existing recursive/autoset logic).
- [x] 3.2 Update `handleMouseDown` to implement simple tile placement for `'brush'` (no recursion).
- [x] 3.3 Ensure `handleMouseMove` (drag painting) respects the new tool distinction.
- [x] 3.4 Verify "Eraser" and "Spawn" tools still function correctly.