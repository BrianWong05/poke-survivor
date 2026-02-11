## 1. Level Editor Updates

- [x] 1.1 Update `constructMapData` in `LevelEditor/components/EditorCanvas` (or index) to ensure `layers` array is fully populated with `id`, `name`, `visible`, `collision`, `locked`, and `tiles`.
- [x] 1.2 Verify `useMapState` correctly manages layer properties and triggers updates when they change.

## 2. Map Manager Updates

- [x] 2.1 Update `MapManager.populateFromLayers` to correctly iterate through `data.layers`.
- [x] 2.2 Implement robust tile ID resolution in `resolveGid`, dealing with potential mismatches or empty tiles (-1).
- [x] 2.3 Review and adjust layer depth assignment. Consider moving map layers to lower depths (e.g. -100) or implementing Y-sorting for "Objects" layer if possible/needed.
- [x] 2.4 Add debug logging to `MapManager.create` to inspector received `CustomMapData` for verification.

## 3. Asset Verification

- [x] 3.1 Verify `Preloader.ts` loads all tilesets with keys matching `LevelEditor`'s `activeAsset` values (filenames).
