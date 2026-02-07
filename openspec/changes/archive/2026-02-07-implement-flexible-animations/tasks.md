## 1. Core System Refactor

- [x] 1.1 Refactor `TileAnimator.ts` to implement `preUpdate(delta)` and `updateLayer(layer)` methods
- [x] 1.2 Update `MapManager.ts` to call `preUpdate` once and `updateLayer` for each layer

## 2. Editor Integration

- [x] 2.1 Update `LevelEditorScene.ts` to use `preUpdate` and `updateLayer`
- [x] 2.2 Remove hardcoded animations in `LevelEditorScene.ts` and implement dynamic registration from `TILE_ANIMATIONS`

## 3. UI Implementation & Verification

- [x] 3.1 Verify `AnimationSelector.tsx` logic and update component structure if needed
- [x] 3.2 Ensure `styles.css` covers all animation UI elements (no Tailwind)
- [x] 3.3 Verify animation preview logic in `AnimationSelector` matches in-game behavior
