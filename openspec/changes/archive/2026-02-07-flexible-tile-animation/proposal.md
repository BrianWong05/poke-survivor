## Why

To enhance the visual quality of the game world by adding life and movement to static environmental elements like flowers, seaweed, and water. A flexible animation system is needed because different tiles have different frame counts and animation speeds.

## What Changes

I will implement a `TileAnimator` class that manages independent animation loops for tile strips. This system will:
- Allow registering animations with specific start IDs, frame counts, and durations.
- Update tiles in specified layers based on elapsed time.
- Handle wrapping animations correctly.

I will then integrate this into the `LevelEditorScene` to animate the "Ground" and "Objects" layers using placeholder assets.

## Capabilities

### New Capabilities
- `tile-animation-system`: Configuration and runtime logic for frame-based tile animations.

### Modified Capabilities
<!-- None -->

## Impact

- **New File**: `src/game/utils/TileAnimator.ts`
- **Modified**: `src/game/scenes/LevelEditorScene.ts`
