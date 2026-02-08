# Tasks: Layer Drag Animation

## 1. Setup & Dependencies

- [x] 1.1 Install dependencies: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [x] 1.2 Verify `LayerPanel.module.css` exists and is ready for modification

## 2. Component Implementation

- [x] 2.1 Create `SortableLayerItem` component in `src/components/LevelEditor/components/SortableLayerItem.tsx`
    - Wrap the existing layer item markup
    - Implement `useSortable` hook
    - Handle drag listeners/attributes
    - Apply transform styles (transition, transform)
    - Ensure it accepts all necessary props for rendering a layer
- [x] 2.2 Refactor `LayerPanel.tsx` to use `DndContext` and `SortableContext`
    - Import Dnd modules
    - Create sensors (mouse, touch, keyboard)
    - Wrap the list validation with `DndContext` implementation
    - Initialize `SortableContext` with layer IDs
    - Implement `onDragStart` to track active layer for overlay
    - Implement `onDragEnd` to handle reordering logic
    - Implement `onDragCancel` to reset state
- [x] 2.3 Implement `DragOverlay` in `LayerPanel.tsx`
    - Render a clone of the active layer item
    - Ensure it has the correct styling (opacity, shadow) via CSS modules
    - Verify it follows the cursor correctly

## 3. Logic & State Updates

- [x] 3.1 Update `onMoveLayer` logic if necessary
    - Ensure the index calculation matches `dnd-kit`'s expectations (it usually gives you the new index directly via `arrayMove` helper or index derivation)
    - Verify `App.tsx` or `useMapState` handles the reorder correctly (the prop `onMoveLayer` exists)

## 4. Verification & Polish

- [x] 4.1 Verify drag animation smooths
- [x] 4.2 Verify list reordering works (visual & logical)
- [x] 4.3 Verify original layer is dimmed/hidden while dragging
- [x] 4.4 Verify accessibility (keyboard sorting with Space/Enter/Arrow keys)
- [x] 4.5 Verify other actions (lock, hide, delete) still work on the items
