## Why

The current tile animation system has a critical bug where animation timers advance multiple times per frame (once per layer), causing animations to run too fast when multiple layers are present. Additionally, the system lacks proper integration with the `TILE_ANIMATIONS` config in the Level Editor, and the UI needs to be verified against the project's styling standards.

## What Changes

- Refactor `TileAnimator` to decouple timer updates from layer application.
- Fix `MapManager` and `LevelEditorScene` to update animations once per frame.
- Remove hardcoded animations in `LevelEditorScene` and use `TILE_ANIMATIONS` config.
- Verify and polish the `AnimationSelector` UI to ensure it adheres to `style.css` (no Tailwind).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `tile-animation-system`: Updates to `TileAnimator` behavior to ensure frame-rate independence and correct multi-layer handling.
- `animation-tile-ui`: Updates to UI components to ensure correct styling and integration.

## Impact

- `src/game/utils/TileAnimator.ts`
- `src/game/systems/MapManager.ts`
- `src/game/scenes/LevelEditorScene.ts`
- `src/components/LevelEditor/AnimationSelector.tsx`
- `src/components/LevelEditor/styles.css`
