# Design: Bridge Generation

## Context
The outdoor map currently consists of procedurally generated ground (grass, dirt), water (lakes), and objects. Water acts as a barrier. We want to introduce bridges to allow traversal over water.

## Goals / Non-Goals

**Goals:**
- Procedurally place bridges over lakes connecting two landmasses.
- Support multiple bridge types: horizontal (long/short), vertical (long/short), and platforms.
- Ensure bridges are walkable (not treated as blocking objects).
- Integrate seamlessly with existing map generation.

**Non-Goals:**
- Complex pathfinding for NPCs across bridges (basic walkability is enough).
- Destructible bridges.

## Decisions

### 1. Bridge Detection Algorithm
We will scan the map for "water gaps" between "ground" tiles.
- **Horizontal Scan**: Look for patterns like `[Ground] [Water...Water] [Ground]`.
- **Vertical Scan**: Look for patterns like `[Ground] [Water...Water] [Ground]` (transposed).
- **Limit**: Bridges will have a maximum length.

### 2. Bridge Type Selection
Based on the length of the water gap:
- **Length 1-2**: Short Bridge or Platforms/Planks.
- **Length 3-6**: Long Bridge.
- **Length > 6**: Ignore (too wide for simple bridge).

### 3. Tile Placement
Bridges will be placed on the `ground` layer or a new `structures` layer?
- **Decision**: Place on `ground` layer (replacing water) OR `objects` layer (if they are objects).
- **Refinement**: Bridges in this tileset seem to be "ground" overrides or "object" overlays.
- **Chosen Approach**: Place on `object` layer (so water can remain underneath visually if needed, though usually bridges replace the underlying tile logic). Actually, looking at the tileset, bridges usually act as the ground.
- **Revised Approach**: Bridges count as "ground" for walkability. We will place them on the `ground` layer or `decoration` layer depending on collision logic. If `ground` layer implies "walkable" and `object` layer implies "collision", then bridges should be on `ground` layer (replacing water) to be walkable.
- **Correction**: The current system uses `ground` for base tiles and `objects` for blocking. Water is `ground`. To make a bridge walkable, we change current `ground` water tile to `bridge` tile.

### 4. Constants & Magic Numbers
Define bridge tile IDs in `constants.ts`.
- `BRIDGE_H_LONG_L`, `BRIDGE_H_LONG_M`, `BRIDGE_H_LONG_R`
- `BRIDGE_V_LONG_T`, `BRIDGE_V_LONG_M`, `BRIDGE_V_LONG_B`
- etc.

## Risks / Trade-offs

- **Risk**: Bridges overlapping with other objects.
    - *Mitigation*: Run bridge generation *after* water/ground but *before* objects (trees/rocks).
- **Risk**: Weird visual tiling at bridge ends.
    - *Mitigation*: Ensure bridge ends have distinct tiles that blend with grass.

## Migration Plan
None needed, purely additive to generation script.
