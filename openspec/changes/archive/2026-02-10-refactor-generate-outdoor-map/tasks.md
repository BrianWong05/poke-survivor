## 1. Setup & Shared Modules

- [x] 1.1 Create `scripts/map-gen` directory structure <!-- id: 1 -->
- [x] 1.2 Create `scripts/map-gen/types.ts` with shared interfaces <!-- id: 2 -->
- [x] 1.3 Create `scripts/map-gen/constants.ts` with shared constants <!-- id: 3 -->

## 2. Utility Modules

- [x] 2.1 Create `scripts/map-gen/utils/common.ts` (random, grids) <!-- id: 4 -->
- [x] 2.2 Create `scripts/map-gen/utils/auto-tile.ts` (mask logic) <!-- id: 5 -->

## 3. Generator Modules

- [x] 3.1 Create `scripts/map-gen/generators/water.ts` (lakes & smoothing) <!-- id: 6 -->
- [x] 3.2 Create `scripts/map-gen/generators/ground.ts` (dirt patches) <!-- id: 7 -->
- [x] 3.3 Create `scripts/map-gen/generators/paths.ts` (BSP & A*) <!-- id: 8 -->
- [x] 3.4 Create `scripts/map-gen/generators/objects.ts` (trees) <!-- id: 9 -->

## 4. Orchestration & Cleanup

- [x] 4.1 Update `scripts/generate_outdoor_map.ts` to use new modules <!-- id: 10 -->
- [x] 4.2 Run generation and verify output consistency <!-- id: 11 -->
