## 1. Map Generator Refactor

- [x] 1.1 Update `constants.ts` to include any necessary tile IDs (e.g. if we need alias for safe water, though we decided to use Ground layer patch). [Optional if not needed]
- [x] 1.2 Update `generate_outdoor_map.ts` to initialize 5 layers (Ground, Water, Bridges, Decorations, Objects) instead of 3.
- [x] 1.3 Modify `generateLakes` in `water.ts` to write to `Water` layer (using `MARKERS.WATER`).
- [x] 1.4 Update `resolveWaterTiles` to resolve tiles in `Water` layer.

## 2. Bridge & Collision Logic

- [x] 2.1 Update `generateBridges` in `bridges.ts` to:
    - [x] Write bridge tiles to `Bridges` layer.
    - [x] Identify water tiles under bridges.
    - [x] Move those water tiles from `Water` layer to `Ground` layer (patching).
- [x] 2.2 Update `generate_outdoor_map.ts` to output the new `layers` array structure with `collision` properties (Water=true, Objects=true).

## 3. Game Engine Update

- [x] 3.1 Update `src/game/systems/MapManager.ts` to:
    - [x] Load the new `layers` array.
    - [x] Set collision based on the `collision` boolean in layer data.
    - [x] Ensure correct depth sorting (Ground < Water < Bridges < Decorations < Objects).

## 4. Verification

- [x] 4.1 Run `npm run generate:map` and verify output JSON structure.
- [x] 4.2 Verify in-game: Lake collision, Bridge walkability, Visual correctness.
