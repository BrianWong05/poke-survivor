## 1. Data Model & Types

- [x] 1.1 Add `LayerData` interface to `src/components/LevelEditor/types.ts` with `id`, `name`, `tiles`, `visible`, `collision` fields
- [x] 1.2 Update `EditorState` to replace `groundLayer`/`objectLayer` with `layers: LayerData[]`
- [x] 1.3 Remove the `LayerType = 0 | 1` type alias (no longer needed)
- [x] 1.4 Add `SerializedLayer` interface to `src/game/types/map.ts` and add optional `layers?: SerializedLayer[]` field to `CustomMapData`

## 2. State Management (useMapState)

- [x] 2.1 Refactor `useMapState` to use a single `layers: LayerData[]` state array instead of separate `groundLayer`/`objectLayer`
- [x] 2.2 Add `currentLayerId: string` state and `setCurrentLayerId` setter
- [x] 2.3 Implement `addLayer()` — appends a new empty layer, sets it as active
- [x] 2.4 Implement `removeLayer(id)` — removes layer by ID, prevents removing last layer, adjusts active layer
- [x] 2.5 Implement `renameLayer(id, name)` — updates a layer's name
- [x] 2.6 Implement `reorderLayer(id, direction)` — moves a layer up or down in the array
- [x] 2.7 Implement `toggleLayerVisibility(id)` — toggles the `visible` flag
- [x] 2.8 Implement `toggleLayerCollision(id)` — toggles the `collision` flag
- [x] 2.9 Update `saveHistory`/`undo`/`redo` to snapshot and restore the full `layers` array
- [x] 2.10 Update `resizeMap` to resize all layers' tile grids
- [x] 2.11 Export a `currentLayer` computed value (the active layer's `TileData[][]`) for use by painting tools
- [x] 2.12 Export a `setCurrentLayerTiles` setter that updates the active layer's tile grid within the `layers` array

## 3. Serialization & Persistence

- [x] 3.1 Update `mapCompression.ts` to serialize `layers` array (compress each layer's tiles using the shared palette)
- [x] 3.2 Update `mapCompression.ts` to also populate `ground`/`objects` from the first two layers for backward compatibility
- [x] 3.3 Update `loadFromData` / `normalizeGrid` in `useMapState` to detect and hydrate the `layers` field, falling back to legacy `ground`/`objects` construction

## 4. UI — Layer Panel

- [x] 4.1 Create `LayerPanel` component in `src/components/LevelEditor/components/LayerPanel.tsx` showing all layers with name, visibility toggle, and delete button
- [x] 4.2 Add active layer highlighting (visual distinction for the selected layer row)
- [x] 4.3 Add "Add Layer" button at the bottom of the panel
- [x] 4.4 Add reorder controls (up/down arrows) per layer row
- [x] 4.5 Add double-click-to-rename on layer name
- [x] 4.6 Add collision toggle control per layer row
- [x] 4.7 Integrate `LayerPanel` into `EditorSidebar`, replacing the old Ground/Objects tab buttons

## 5. Canvas Rendering

- [x] 5.1 Update `EditorCanvas` to iterate over `layers` array in order, skipping layers with `visible: false`
- [x] 5.2 Ensure painting tools reference the active layer's tile grid via `currentLayer`/`setCurrentLayerTiles`

## 6. Game Integration

- [x] 6.1 Update `MapManager.createCustomMap` to iterate over `layers` array (or fall back to legacy two-layer construction)
- [x] 6.2 Set collision on Phaser tilemap layers based on each layer's `collision` flag
- [x] 6.3 Update the play/export flow in `index.tsx` to pass the full layers data to the game scene

## 7. Styling

- [x] 7.1 Add CSS for the layer panel (layer rows, active highlight, visibility icon, delete button, reorder arrows) in `styles.css`
