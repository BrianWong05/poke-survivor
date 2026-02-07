## 1. Setup & Zoom State

- [x] 1.1 Add `zoom` and `setZoom` to `useMapState` <!-- id: 1.1 -->
- [x] 1.2 Implement zoom constraints (min/max/step) in `useMapState` <!-- id: 1.2 -->
- [x] 1.3 Add keyboard shortcuts (Ctrl+Plus/Minus/Zero) <!-- id: 1.3 -->

## 2. Rendering Updates

- [x] 2.1 Update `LevelEditor` to pass zoom state to `EditorCanvas` <!-- id: 2.1 -->
- [x] 2.2 Apply CSS transform scale to `canvas` element in `EditorCanvas` <!-- id: 2.2 -->
- [x] 2.3 Adjust `handleMouseDown` and `useMouseMove` coordinate calculation <!-- id: 2.3 -->
- [x] 2.4 Verify drawing and tool usage at different zoom levels <!-- id: 2.4 -->

## 3. UI Controls

- [x] 3.1 Create `ZoomControls` component (Slider/Buttons) <!-- id: 3.1 -->
- [x] 3.2 Integrate `ZoomControls` into `EditorSidebar` <!-- id: 3.2 -->
- [x] 3.3 Add mouse wheel zoom support (Ctrl+Wheel) <!-- id: 3.3 -->

## 4. Verification

- [x] 4.1 Verify all tools work correctly at 50% and 200% zoom <!-- id: 4.1 -->
- [x] 4.2 Verify mouse wheel behavior <!-- id: 4.2 -->
- [x] 4.3 Verify keyboard shortcuts <!-- id: 4.3 -->
