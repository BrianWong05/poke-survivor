## Why

The user wants the spawn point of the map to be centered on the play screen when the game starts. Currently, there may be a lag or offset in the camera centering, or the spawn point itself might need to be explicitly set to the map center.

## What Changes

I will modify `MainScene.ts` to ensure that:
1. The player's spawn position defaults to the center of the physics world (1600, 1600) if no custom map data is provided.
2. The camera explicitly centers on the player immediately upon creation, preventing any initial panning or lerping from (0,0).
3. The camera follow logic is consolidated to ensure consistent behavior.

## Capabilities

### Modified Capabilities
- `camera-system`: The camera will now strictly ensure the player is centered in the viewport at the start of the scene.

## Impact

- `src/game/scenes/MainScene.ts`: Update `createPlayer` and `create` methods to handle camera centering and spawn positioning.
