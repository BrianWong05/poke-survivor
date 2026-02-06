## Why

Several environmental assets that were intended to be animated (Water currents, Seaweed, etc.) are currently incorrectly categorized as static AutoTiles. This prevents them from being correctly animated in the game and makes them difficult to use in the Level Editor's animation tab.

## What Changes

- Move 7 assets from `src/assets/Autotiles/` to `src/assets/Animations/`.
- Register these assets in `src/game/config/TileAnimations.ts` with appropriate frame counts and durations.
- Ensure these animations are available in the Level Editor's "Animation" tab.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `tile-animation-system`: Expand the set of registered environmental animations.

## Impact

- `src/assets/Autotiles/`: Files will be removed.
- `src/assets/Animations/`: Files will be added.
- `src/game/config/TileAnimations.ts`: New entries will be added.
- Level Editor: The new animations will appear in the Animation selector.
- Game Scenes: Existing maps using these tiles as autotiles might need manual updates (though these were likely unusable as autotiles due to incorrect dimensions).
