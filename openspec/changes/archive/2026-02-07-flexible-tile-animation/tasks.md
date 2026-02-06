## 1. Core Implementation

- [x] 1.1 Create `src/game/utils/TileAnimator.ts`
  - Define `TileAnimator` class with tileset-aware checks.
- [x] 2.1 Update `src/game/scenes/LevelEditorScene.ts`
  - Registered test animations.

## 2. Organization & Fixes

- [x] 2.1 Create `src/assets/Animations/` folder and migrate assets.
- [x] 2.2 Update `LevelEditor` and `Preloader` for new folder structure.
- [x] 2.3 Integrate `TileAnimator` into `MainScene`.
- [x] 2.4 Fix "Field of Flowers" bug (GID Conflict)
  - Identified that multiple tilesets were starting at GID 0, causing grass/flower overlap.
  - Implemented manual GID offset management in `MainScene.ts` to ensure unique ranges for every tileset.
  - Verified `TileAnimator` correctly uses tileset-specific ranges.

## 3. Verification

- [x] 3.1 Manual Verification
  - Run `npm run dev`.
  - Confirm background grass is static and individual flowers animate.
  - Confirm GID conflicts are resolved (check browser console if needed).