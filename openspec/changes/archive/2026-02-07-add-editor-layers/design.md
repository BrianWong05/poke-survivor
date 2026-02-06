## Context

The Level Editor currently manages two hard-coded layers (`groundLayer` and `objectLayer`) as separate `useState` arrays in `useMapState`. The `CustomMapData` type in `src/game/types/map.ts` has fixed `ground` and `objects` fields. The `MapManager` creates exactly two Phaser tilemap layers. All painting, undo/redo, resize, save/load, and rendering logic references these two layers by name.

The editor UI shows two static tab buttons ("Ground" / "Objects") in `EditorSidebar`. The canvas renders ground first, then objects, with no ability to toggle visibility or reorder.

## Goals / Non-Goals

**Goals:**
- Replace the fixed two-layer model with a dynamic `layers` array
- Allow users to add, remove, rename, and reorder layers
- Support per-layer visibility toggle and collision flag
- Maintain backward compatibility with existing saved maps
- Keep the undo/redo system working with the new layer model

**Non-Goals:**
- Layer opacity/blending modes — out of scope for this change
- Layer grouping or folder hierarchy
- Multi-layer simultaneous painting
- Per-tile metadata beyond what `TileData` already stores

## Decisions

### 1. Unified layers array instead of named state variables

**Decision**: Replace `groundLayer`/`objectLayer` state with a single `layers: LayerData[]` array.

```typescript
interface LayerData {
  id: string;        // Unique identifier (nanoid or crypto.randomUUID)
  name: string;      // User-facing display name
  tiles: TileData[][]; // 2D tile grid
  visible: boolean;  // Editor visibility toggle
  collision: boolean; // Whether this layer has collision in-game
}
```

**Rationale**: A single array is naturally extensible — adding a layer is `push`, removing is `filter`, reordering is `splice`. Named variables require code changes for each new layer.

**Alternative considered**: A `Map<string, TileData[][]>` keyed by layer name — rejected because Map doesn't preserve insertion order reliably for rendering, and layer order matters.

### 2. Current layer selection by ID, not index

**Decision**: Store `currentLayerId: string` instead of `currentLayer: LayerType (0|1)`.

**Rationale**: Index-based references break when layers are reordered or deleted. ID-based selection remains stable regardless of position changes.

### 3. Backward-compatible serialization

**Decision**: The `CustomMapData` type gains an optional `layers` field. When present, it takes precedence over `ground`/`objects`. Legacy maps without `layers` are hydrated into a two-layer array on load.

```typescript
interface CustomMapData {
  width: number;
  height: number;
  tileSize: number;
  palette?: TileData[];
  // Legacy fields (kept for backward compatibility)
  ground: (number | TileData)[][];
  objects: (number | TileData)[][];
  // New field
  layers?: SerializedLayer[];
  spawnPoint?: { x: number; y: number };
}

interface SerializedLayer {
  id: string;
  name: string;
  tiles: number[][]; // Palette indices
  collision: boolean;
}
```

**Rationale**: Existing maps continue to load without migration. New saves use the `layers` format. The `ground`/`objects` fields are still populated for backward compatibility with older editor versions.

### 4. Default layer setup

**Decision**: New maps start with two layers: "Ground" (no collision) and "Objects" (collision enabled), mirroring current behavior.

**Rationale**: Maintains familiarity for existing users. They can add/remove layers from this starting point.

### 5. Layer panel UI placement

**Decision**: Replace the existing Ground/Objects tab buttons with a vertical layer panel in the sidebar. Each layer row shows: name, visibility eye icon, and a delete button. Add/reorder controls at the bottom.

**Rationale**: Follows conventions from Tiled, Photoshop, and similar tools. Keeps the sidebar compact.

### 6. MapManager multi-layer consumption

**Decision**: `MapManager.createCustomMap` iterates over the `layers` array (or falls back to legacy two-layer construction) and creates one Phaser tilemap layer per entry, setting collision based on each layer's `collision` flag.

**Rationale**: Straightforward extension of existing logic. Depth ordering follows array index.

## Risks / Trade-offs

- **Risk**: Undo/redo state size grows with more layers → **Mitigation**: Keep the existing 50-state history limit. Layer data is shallow-copied (same as current approach). Could add structural sharing later if needed.
- **Risk**: Legacy map files won't have the `layers` field → **Mitigation**: Hydration logic in `useMapState.loadFromData` detects missing `layers` and constructs a two-layer array from `ground`/`objects`.
- **Trade-off**: Saving both `layers` and `ground`/`objects` fields duplicates data → Acceptable for backward compatibility; palette compression keeps file sizes small.
- **Risk**: Canvas performance with many layers → **Mitigation**: Visibility toggle lets users hide layers they're not working on. Practical layer count is expected to be 2–6.
