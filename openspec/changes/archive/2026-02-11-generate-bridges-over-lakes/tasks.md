## 1. Setup

- [x] 1.1 Add Bridge Tile IDs to `scripts/map-gen/constants.ts` (Horizontal, Vertical, Platforms)
- [x] 1.2 Verify `TILESET_NAME` and palette structure supports new tiles
    
## 2. Generator Implementation
    
- [x] 2.1 Create `scripts/map-gen/generators/bridges.ts`
- [x] 2.2 Implement `findBridgeLocations` function to detect water gaps
- [x] 2.3 Implement `placeBridge` function to draw bridge tiles
- [x] 2.4 Implement `resolveBridgeEdges` to ensure clean transitions

## 3. Integration

- [x] 3.1 Import `generateBridges` in `scripts/generate_outdoor_map.ts`
- [x] 3.2 Add `generateBridges` call to `generateOutdoorMap` pipeline (after water/dirt, before objects)
- [x] 3.3 Ensure bridge tiles are added to the map palette

## 4. Verification

- [x] 4.1 Run `npx tsx scripts/generate_outdoor_map.ts` to generate map
- [x] 4.2 Inspect `src/assets/maps/outdoor.json` for bridge tile usage
- [x] 4.3 Visual inspection in Game/Editor (if possible) or via JSON check
