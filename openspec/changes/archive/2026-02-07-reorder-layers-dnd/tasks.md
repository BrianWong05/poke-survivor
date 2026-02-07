## 1. Core State Logic

- [x] 1.1 Add `moveLayer` function to `useMapState` hook in `src/components/LevelEditor/hooks/useMapState.ts`
- [x] 1.2 Export `moveLayer` from the `useMapState` hook

## 2. Component Integration

- [x] 2.1 Update `LayerPanelProps` in `src/components/LevelEditor/components/LayerPanel.tsx` to include `onMoveLayer`
- [x] 2.2 Implement native DnD event handlers (`onDragStart`, `onDragOver`, `onDrop`) in `LayerPanel` component
- [x] 2.3 Apply DnD attributes and handlers to layer rows in `LayerPanel`
- [x] 2.4 Update `EditorSidebar` props and implementation to pass `onMoveLayer` to `LayerPanel`
- [x] 2.5 Update `LevelEditor` in `src/components/LevelEditor/index.tsx` to pass `mapState.moveLayer` down to `EditorSidebar`

## 3. Verification

- [x] 3.1 Verify layers can still be reordered with buttons
- [x] 3.2 Verify layers can be reordered via drag and drop
- [x] 3.3 Verify rendering order updates correctly on canvas after DnD

## 4. Visual Enhancements

- [x] 4.1 Add drag-over highlight state to `LayerPanel`
- [x] 4.2 Update `styles.css` with drop indicator animations
