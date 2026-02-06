## Context

The current game world is static. We want to add life by animating tiles like flowers, seaweed, and water. These animations are frame-swaps within the tilemap.

## Goals / Non-Goals

**Goals:**
- Implement a `TileAnimator` class to handle frame updates.
- Support multiple independent animations with different frame counts and speeds.
- Integrate into `LevelEditorScene` for immediate feedback.

**Non-Goals:**
- Animation of entities/sprites (this is strictly for tilemap tiles).
- Complex animation state machines (just simple looping strips).

## Decisions

- **Architecture**: `TileAnimator` will be a standalone utility class instantiated by the Scene.
- **Update Logic**: The `update` method will track time for each registered animation independently. When a timer triggers (elapsed > duration), it will scan the specified layer(s) and replace all instances of the current frame with the next frame in the sequence.
- **Configuration**: Animations are defined by `startId`, `frameCount`, and `duration`.

## Risks / Trade-offs

- **Performance**: Scanning the entire tilemap layer can be expensive if done too frequently or on very large maps.
  - *Mitigation*: We only scan when an animation frame needs to update, not every game frame. Different animations have different intervals, spreading the load.
