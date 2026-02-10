# Spec: Fix Layer Opacity and Allow Deselection

## 1. Background
The current implementation of the Level Editor forces non-selected layers to be rendered with reduced opacity (0.4). This hinders visibility when editing. Furthermore, the user cannot deselect a layer, meaning one layer is always active, which might lead to accidental edits or visual clutter.

## 2. Requirements
- **Must** render all layers with full opacity (1.0) when no layer is selected.
- **Must** render non-selected layers with reduced opacity (0.4) when a specific layer is selected for editing focus.
- **Must** allow `currentLayerId` to be `null` (no active layer).
- **Must** provide a way to deselect the current layer (e.g., clicking on the active layer again in the layer panel).
- **Must** ensure that when no layer is selected, tools (brush, eraser, etc.) do not operate or show a warning/disabled state (except maybe "spawn" tool if global).
- **Should** visually indicate in the `LayerPanel` when no layer is selected (no highlight).

## 3. API Changes
### `useMapState.ts`
- `currentLayerId`: `string` -> `string | null`
- `setCurrentLayerId`: `(id: string) => void` -> `(id: string | null) => void`

### `LayerPanel.tsx`
- `onSelectLayer`: `(id: string) => void` -> `(id: string | null) => void` (or handle internal toggle)

## 4. Implementation Details
- **Opacity:** In `EditorCanvas.tsx`, remove the `alpha` calculation based on selection.
- **Deselection interaction:** In `LayerPanel.tsx`, `SortableLayerItem` `onSelect` handler should check if `layer.id === currentLayerId`. If so, call `onSelectLayer(null)` (if prop updated) or parent handles it.
- **Tool Safety:** In `LevelEditor/index.tsx`, `handlePaint` and `handleDragEnd` checks should guard against `currentLayerId` being null. `mapState.layers.find(l => l.id === mapState.currentLayerId)` will return undefined if null, so logic must handle `undefined`.
