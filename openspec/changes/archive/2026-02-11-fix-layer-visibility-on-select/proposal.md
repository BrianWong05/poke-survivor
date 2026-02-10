# Proposal: Fix Layer Opacity on Selection

## Problem
Currently, when a user selects a layer in the Level Editor, all other layers are rendered with reduced opacity (0.4). This makes it difficult to view the overall map composition while editing a specific layer. Additionally, the user wants the ability to "deselect" a layer to view the map in its full state without any layer being active.

## Solution
1.  **Remove Opacity Dimming:** Update `EditorCanvas.tsx` to always render layers at full opacity (1.0), regardless of selection.
2.  **Enable Layer Deselection:** Update the `currentLayerId` state management to allow `null` (no selection).
    *   Modify `useMapState` to allow `currentLayerId` to be `string | null`.
    *   Update `LayerPanel` to confirm visual indication of "no selection".
    *   Update `EditorCanvas` and other consumers to handle `currentLayerId` being null safely.

## Proposed Changes
### `src/components/LevelEditor`
#### [MODIFY] `components/EditorCanvas.tsx`
- Remove the conditional alpha calculation: `const alpha = layer.id === currentLayerId ? 1.0 : 0.4;`
- Always use `1.0` or remove the globalAlpha setting for layers.
- Handle `currentLayerId` being null gracefully (if logic depends on it).

#### [MODIFY] `hooks/useMapState.ts`
- Update `currentLayerId` state type to `string | null`.
- Update `setCurrentLayerId` to accept `string | null`.
- Ensure initial state or logic accounts for null.

#### [MODIFY] `components/LayerPanel.tsx`
- Update `onSelectLayer` prop type.
- Add interaction to deselect (e.g., clicking active layer deselects).

#### [MODIFY] `index.tsx` (LevelEditor)
- Update how `handlePaint` checks for `currentLayerId`.
- Update prop types if needed.

## Capabilities
- [Fix Layer Opacity]
- [Allow Layer Deselection]

## Impact
- **Visuals:** Map will always look "complete" even when a layer is selected.
- **UX:** Users can inspect the map more easily. Users can deselect layers to prevent accidental edits.
