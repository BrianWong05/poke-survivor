## Why

The current map generation places all tiles on a single "Ground" layer or "Objects" layer, which limits the ability to handle collision correctly for features like lakes. The user specifically requested that lakes should be in a separate layer and the player should not be able to walk through them. This requires introducing a multi-layer system with configurable collision properties.

## What Changes

We will refactor the map generation to produce a multi-layer map structure:
1. **Ground**: Base layer for grass, dirt, paths, and "safe water" under bridges. (Non-collidable)
2. **Water**: Collidable layer for lakes.
3. **Bridges**: Walkable layer for bridges (visually above water).
4. **Decorations**: Flowers and other non-collidable items.
5. **Objects**: Trees and rocks (Collidable).

We will also update the `MapManager` to correctly handle collision settings defined in the map data, allowing specific layers (like Water) to be collidable.

## Capabilities

### New Capabilities
- `layered-map-gen`: Generates maps with explicit layer definitions (name, depth, tiles, collision).

### Modified Capabilities
- `map-loading`: MapManager will support loading the new layered format and applying collision rules.

## Impact

- `scripts/generate_outdoor_map.ts`: Major refactor to use the new layer structure.
- `scripts/map-gen/generators/water.ts`: Updated to write to `Water` layer.
- `scripts/map-gen/generators/bridges.ts`: Updated to handle bridge/water interaction (patching safe water).
- `src/game/systems/MapManager.ts`: Updated to support granular collision configuration.
