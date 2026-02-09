# Proposal: Fix Tileset Selection Reset

## Goal
The goal is to ensure that when a user switches the active tileset in the Level Editor, the selected tile in the palette resets to the first position (0,0). This prevents the selection from remaining at coordinates that might not exist or be relevant in the new tileset.

## Proposed Changes
- In `LevelEditor/index.tsx`, update the `onAssetChange` handler to reset the `selection` state to `{ x: 0, y: 0, w: 1, h: 1 }`.
