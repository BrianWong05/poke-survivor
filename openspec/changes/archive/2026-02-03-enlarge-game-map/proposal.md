## Why

The current game confines the player to a single screen, limiting exploration and gameplay variety. A larger, explorable world with a camera that follows the player creates a more immersive survivor-game experience and opens possibilities for varied terrain, spawn zones, and strategic movement.

## What Changes

- Expand the game world from a single screen (~800x600) to a 3200x3200 pixel map.
- Create a procedural grid-pattern background texture so movement is visually apparent.
- Implement camera bounds and player-following behavior with smooth easing.
- Constrain the player within the physics world bounds so they cannot walk off the edge.

## Capabilities

### New Capabilities
- `camera-system`: Camera follows the player smoothly and respects world bounds.
- `large-map`: Procedural tiled background spanning 3200x3200 pixels with physics boundaries.

### Modified Capabilities
<!-- None - this is additive and does not change existing spec-level requirements -->

## Impact

- **Modified Files**: `src/game/scenes/MainScene.ts`
- **Player Spawning**: Player will now spawn at the center of the large map (1600, 1600) instead of map center relative to screen.
- **Enemy Spawning**: Spawning logic may need adjustment to spawn around the player's camera view rather than screen edges (future consideration).
- **Performance**: TileSprite-based background is performant; no significant impact expected.
