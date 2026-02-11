## Context
The Level Editor allows users to create and edit maps with multiple layers, custom tilesets, and collision regions. When users click "Play Test", the current map data is serialized and passed to the Game Scene. However, users report that the map rendered in-game is incorrect—specifically missing tiles, incorrect layering, or misaligned objects. This suggests a mismatch between how `LevelEditor` serializes data and how `MapManager` deserializes and renders it.

## Goals / Non-Goals

**Goals:**
- Ensure `LevelEditor` serializes map data correctly, including all layer properties (id, name, visible, collision, tiles).
- Ensure `MapManager` correctly interprets the serialized map data, resolving tile IDs to the correct tileset textures.
- Verify that `Preloader` loads all necessary tileset assets used by the editor.
- Fix any depth/z-index issues where map layers might be hidden or rendered incorrectly relative to the player.

**Non-Goals:**
- Validating the map content itself (e.g. check if path is walkable).
- Changing the map file format (we stick to `CustomMapData`).

## Decisions
- **Unified Tileset Loading**: We will ensure that both `LevelEditor` (via `useAssetLibrary`) and `Game` (via `Preloader`) load tilesets using identical keys (filenames). This is already largely in place but will be verified.
- **Explicit Layer Depth**: `MapManager` currently assigns depths `-10 + index`. We will review if this range conflicts with Game Objects. We might shift the map layers to a lower depth range (e.g., starting at `-100`) to ensure they are always behind gameplay entities, `OR` implement a more sophisticated Y-sorting for "Objects" layers if needed. For now, pushing map layers further back is safer to ensure visibility.
- **Robust Serialization**: `compressMapData` will be reviewed to ensure it doesn't drop layers or miscalculate tile IDs.

## Risks / Trade-offs
- **Legacy Maps**: We must ensure that any changes to `MapManager` don't break existing saved maps that rely on the legacy `ground`/`objects` fields. `MapManager` currently handles both; we will preserve this logic.
- **Depth Conflicts**: Changing layer depths might affect existing rendering order for other elements (like background grid).
