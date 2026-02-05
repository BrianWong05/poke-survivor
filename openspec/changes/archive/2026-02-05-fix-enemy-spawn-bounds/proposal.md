## Why

Enemies in the game currently spawn at a fixed radius around the player. When the player is near the edge of the large map (3200x3200), this behavior can result in enemies spawning outside the playable map boundaries. This causes enemies to be invisible or unreachable, which negatively impacts gameplay and performance.

## What Changes

I will update the `EnemySpawner` logic to ensure that all generated spawn coordinates are clamped within the world bounds (0-3200 for both X and Y).

## Capabilities

### Modified Capabilities
- `enemy-system`: Ensure enemy spawn positions are always within map boundaries.

## Impact

- `EnemySpawner.ts`: Update the `spawn` method to clamp coordinates.
- Gameplay: Enemies will always spawn within the playable area.
