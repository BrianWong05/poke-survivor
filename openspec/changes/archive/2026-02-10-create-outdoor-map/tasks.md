## 1. Setup

- [x] 1.1 Create `scripts/generate_outdoor_map.ts` scaffold with `CustomMapData` types imported or redefined.
- [x] 1.2 Define Tile ID constants mapping to `Outside.png` indices (e.g. Grass=2).

## 2. Implementation

- [x] 2.1 Implement base terrain generation (fill with Grass).
- [x] 2.2 Implement procedural feature generation:
    - Water bodies (Lakes) using cellular automata or noise.
    - Paths using random walkers.
- [x] 2.3 Implement object placement:
    - Trees and Rocks on valid ground (not water/path).
    - Buildings and Bridges (if feasible procedurally, or just placeholders).
- [x] 2.4 Implement Collision Logic:
    - Set `collision: true` for Trees, Rocks, Buildings, Water.
- [x] 2.5 Implement JSON file writing to `src/assets/maps/outdoor.json`.

## 3. Verification

- [ ] 3.1 Run generation script and verify `outdoor.json` is created without errors.
- [ ] 3.2 Validate JSON structure matches `CustomMapData`.
- [ ] 3.3 Load map in game/editor and visually verify content and collisions.
