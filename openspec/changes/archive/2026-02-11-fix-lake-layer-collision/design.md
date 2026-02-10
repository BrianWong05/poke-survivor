## Context

The current outdoor map generator produces a flat structure with only `ground` and `objects` layers exposed to the MapManager in a legacy format. This format does not support defining collision properties per layer, and forces all "ground" tiles (including water) to be non-collidable. To support lakes that block player movement, we need to separate water into a collidable layer. However, bridges must remain walkable while appearing above/over the water.

## Goals / Non-Goals

**Goals:**
- Generate map data with an array of `layers`, each with a `name`, `tiles` (2D grid), and `collision` settings.
- Separate Water into its own layer with collision enabled.
- Ensure Bridges are walkable and visually correct (appearing over water).
- Maintain existing object and decoration functionality.

**Non-Goals:**
- Implementing complex physics shapes (we stick to tile-based collision).
- Changing the visual style of the map (same tilesets).

## Decisions

### 1. 5-Layer Structure
We will use a 5-layer structure for the outdoor map:
1. **Ground** (Depth -10): Grass, Dirt, Paths. Non-collidable.
2. **Water** (Depth -9): Lakes. Collidable.
3. **Bridges** (Depth -8): Bridges. Non-collidable (Walkable).
4. **Decorations** (Depth -7): Flowers. Non-collidable.
5. **Objects** (Depth -6): Trees, Rocks. Collidable.

### 2. Handling Bridges over Water
To make bridges walkable over collidable water:
- The **Water Layer** will have "holes" (empty tiles) under bridge segments.
- The **Ground Layer** will be patched with "Water" tiles at these bridge locations.
- Since the Ground Layer is non-collidable, the player can walk on the bridge (which is visually on the Bridges layer, but spatially logically safe).
- This creates the visual illusion of a continuous lake while removing collision specifically under the bridge.

### 3. MapManager Update
We will update `MapManager.ts` to fully support the `layers` array in the map JSON. It will respect the `collision: boolean` property for each layer.

## Risks / Trade-offs

- **Complexity**: The map generation logic becomes slightly more complex due to the "patching" step for bridges.
- **Visual Artifacts**: If the patched water tiles in the Ground layer don't perfectly match the surrounding Water layer tiles (e.g. autotile borders), there might be visual seams. We minimize this by using the "Center" water tile for patched areas, or copying the exact tile ID if possible (though edge tiles might look weird if isolated). Since bridges usually cross the "body" of the water, center tiles should work well.
