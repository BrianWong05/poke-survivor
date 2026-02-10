# Design: Prevent Objects on Water and Bridges

## Context

The current map generation logic places objects (trees, rocks) and decorations (flowers) based solely on the ground layer. It does not account for the water and bridge layers, which are generated separately. As a result, objects can appear on water or block bridges. This design addresses this by making the object and decoration generators aware of these layers.

## Goals / Non-Goals

**Goals:**
- Prevent trees, rocks, and other collidable objects from spawning on water tiles.
- Prevent trees, rocks, and other collidable objects from spawning on bridge tiles.
- Prevent flowers and other decorations from spawning on water or bridge tiles.
- Ensure that the density of objects remains reasonable despite the reduced placement area.

**Non-Goals:**
- Changing the generation algorithms for lakes or bridges themselves.
- Introduction of new object types or biomes.

## Decisions

### Layer Awareness
We will pass the `waterTiles` and `bridgeTiles` arrays to the `generateObjects` and `generateFlowers` functions.
- **Why**: These arrays contain the definitive state of the water and bridge layers at the time of object generation. `waterTiles` has `-1` for no water, and other values for water tiles. `bridgeTiles` has `-1` for no bridge, and IDs for bridge parts.
- **Alternative**: We could merge all layers into a single collision map before generating objects, but passing the specific layers is simpler and requires less refactoring of the existing pipeline.

### Check Logic
In `generateObjects` and `generateFlowers`:
- Before placing an object at `(x, y)`, we will check:
  ```typescript
  if (waterTiles[y][x] !== -1) return false; // Is water
  if (bridgeTiles[y][x] !== -1) return false; // Is bridge
  ```
- This check will be added inside the existing placement loops.

### Interface Changes
- `generateObjects` signature:
  ```typescript
  export function generateObjects(
    groundTiles: number[][],
    waterTiles: number[][],  // NEW
    bridgeTiles: number[][], // NEW
    objectTiles: number[][],
    grassIndex: number,
    getPaletteIndex: any,
    paletteIds: any
  )
  ```
- `generateFlowers` signature:
  ```typescript
  export function generateFlowers(
    groundTiles: number[][],
    waterTiles: number[][],  // NEW
    bridgeTiles: number[][], // NEW
    objectTiles: number[][],
    decorationTiles: number[][],
    grassIndex: number,
    flowerIndices: number[]
  )
  ```

## Risks / Trade-offs

- **Risk**: Reduced object count.
  - **Mitigation**: The current spawn rates are high enough (2000 attempts for objects, 1000 for flowers) that skipping water/bridges shouldn't significantly impact the overall feel. If the map feels too empty, we can increase the iteration counts or add a "retry" mechanism, but simple skipping is usually sufficient for this style of generation.

- **Trade-off**: Slightly more arguments passed to functions.
  - **Impact**: Minimal impact on code complexity.
