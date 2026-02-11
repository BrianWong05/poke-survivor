## Why
Users report that the map rendered during "Play Test" is incorrect, often showing missing tiles, wrong layers, or incorrect object placement. This discrepancy prevents effective level design and testing. The issue likely stems from inconsistencies in how map data is serialized in the Editor compared to how it is interpreted and rendered by the `MapManager` in the game scene, specifically regarding layer depth handling and potential tile ID resolution mismatches.

## What Changes
We will modify the `LevelEditor` to ensure robust map data serialization, including all layer properties. We will also update the `MapManager` in the game to correctly interpret the modern multi-layer map format, ensuring that layers are rendered at the correct depths (respecting Y-sorting where appropriate) and that tile IDs are correctly resolved against the loaded tilesets. We will verify that asset loading in `Preloader` matches the editor's expectations.

## Capabilities

### New Capabilities
- `test-play-map-sync`: Ensures that the map data passed from the Level Editor to the Game Scene is perfectly synchronized, preserving layer order, tile placement, and object properties.

### Modified Capabilities
- `level-editor`: Updates the `constructMapData` logic to ensure data integrity.
- `map-manager`: Updates map generation logic to correctly handle dynamic layers and potential legacy data formats.

## Impact
- `LevelEditor`: `constructMapData`, `useMapState`
- `Game`: `MapManager`, `MainScene`, `Preloader`
- **Risk**: Low. Mostly refinements to data handling. Backward compatibility for existing save files must be maintained.
