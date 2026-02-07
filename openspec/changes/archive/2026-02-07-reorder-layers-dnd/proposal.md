## Why

Currently, layers in the Level Editor can only be reordered using "Up" and "Down" buttons, which is slow and cumbersome for many layers. Drag and drop provides a more intuitive and efficient way to reorder layers, aligning with modern editing software conventions.

## What Changes

- Add drag-and-drop capability to the `LayerPanel` component.
- Users can click and drag a layer row to a new position in the list.
- The layer list should update visually during dragging or upon drop.
- The underlying `layers` state should update to reflect the new order.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `editor-layers`: Enhance "Reorder Layers" requirement to include drag-and-drop reordering.

## Impact

- `src/components/LevelEditor/components/LayerPanel.tsx`: UI changes to implement drag-and-drop.
- `src/components/LevelEditor/hooks/useMapState.ts`: Add `moveLayer` helper to handle arbitrary index movement.
- `src/components/LevelEditor/index.tsx`: Pass down new handler.
