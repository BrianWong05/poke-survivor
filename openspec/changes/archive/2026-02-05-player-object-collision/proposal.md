## Why

The player is currently able to pass through all objects on the map, including those that should be solid (trees, rocks, buildings). This reduces the strategic element of map design and breaks game immersion.

## What Changes

- Enable physics collision on the `Objects` layer within `MainScene`.
- Configure the `Objects` layer to be solid by default, while the `Ground` layer remains traversable.
- Support map-specific collision data if needed, though for now, all non-empty tiles on the `Objects` layer will be treated as collidable.

## Capabilities

### New Capabilities
- `player-object-collision`: Prevents the player from entering tiles occupied by sprites on the objects layer.

### Modified Capabilities
- (None)
