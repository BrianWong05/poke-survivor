# Design: Fix Tileset Selection Reset

## User Interface
No visual changes to the UI layout. The interaction behavior will change slightly:
- When a user selects a different tileset from the dropdown menu, the selection highlight in the palette will jump to the top-left tile (index 0).

## Technical Implementation
- **Component**: `LevelEditor/index.tsx`
- **State**: `selection` state ({ x, y, w, h }).
- **Logic**:
    - Inside `onAssetChange` handler in `LevelEditor`, after updating `activeAsset`, call `setSelection({ x: 0, y: 0, w: 1, h: 1 })`.
