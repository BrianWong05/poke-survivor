## Context

The `EnemySpawner` generates spawn positions using a random point on a circle around the player (radius ~600). The game world has a fixed size of 3200x3200 pixels. Currently, the spawner does not account for these world boundaries, which leads to enemies spawning in invalid coordinates.

## Goals / Non-Goals

**Goals:**
- Ensure all enemy spawn positions are within the [0, 3200] coordinate range for both X and Y axes.
- Minimal performance impact.

**Non-Goals:**
- Changing the spawning radius or visual logic of how enemies appear.
- Changing the world size.

## Decisions

- **Clamping Spawn Points**: I will use dynamic clamping logic in the `EnemySpawner.ts` file right after the random position is calculated. I will use `this.scene.physics.world.bounds` to ensure the spawn points are always within the actual playable area, regardless of the map size (default 3200x3200 or custom 20x20).
- **Phaser Clamp**: Use `Phaser.Math.Clamp` for readability and consistency with the engine.

## Risks / Trade-offs

- **Spawn Density**: When the player is near a corner, enemies will be forced to spawn within the available map space, potentially increasing local density as the "circle" is clipped by the map edges. This is acceptable and preferred over out-of-bounds spawning.
- **Unreachable areas**: If the map has obstacles at the edges (which it currently doesn't, but might in the future), enemies might still spawn in awkward spots, but they will at least be within the physics world.
