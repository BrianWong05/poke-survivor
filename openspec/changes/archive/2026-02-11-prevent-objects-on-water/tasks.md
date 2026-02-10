# Tasks: Prevent Objects on Water

## 1. Implementation

- [x] 1.1 Modify `generateObjects` in `objects.ts` to accept water/bridge layers and check collision.
- [x] 1.2 Modify `generateFlowers` in `decorations.ts` to accept water/bridge layers and check collision.
- [x] 1.3 Update `generate_outdoor_map.ts` to pass the correct layers to the generators.

## 2. Verification

- [x] 2.1 Run map generation script: `npx tsx scripts/generate_outdoor_map.ts`
- [x] 2.2 Manually verify the generated map in-game or via JSON inspection.
