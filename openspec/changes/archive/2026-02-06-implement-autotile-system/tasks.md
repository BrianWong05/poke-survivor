## 1. Core Logic Implementation

- [x] 1.1 Implement `src/game/utils/AutoTileTable.ts` with `BITMASK_TO_INDEX` and `getAutoTileId`.
- [x] 1.2 Implement `src/game/utils/AutoTileGenerator.ts` with texture slicing logic (`generate`, `drawQuad`).

## 2. Placement Logic Implementation

- [x] 2.1 Implement `src/game/utils/AutoTiler.ts` logic (`updateTileRecursive`, `refreshSingleTile`).

## 3. Integration

## 4. React Level Editor Integration (New)

- [x] 4.1 Create `src/components/LevelEditor/utils.ts` with `generateAutoTileTexture` (Canvas API) and `updateAutoTileGrid`.
- [x] 4.2 Update `src/components/LevelEditor/index.tsx` to handle `autoset` loading and recursive placement.

## 5. Bug Fixes

- [x] 5.1 Fix "Vertical Line" glitch in AutoTileGenerator (far edge coordinates).
