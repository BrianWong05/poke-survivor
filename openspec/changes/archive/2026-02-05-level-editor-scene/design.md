## Context

The game currently uses hardcoded or procedural maps in `MainScene`. There is no visual authoring tool for level design. This design describes the technical implementation of a tile-based **Level Editor** scene inspired by RPG Maker XP, enabling rapid iteration on map layouts.

Existing scene architecture uses Phaser 3 scenes (`MainScene`, `LevelUpScene`, `Preloader`). The new `LevelEditorScene` will follow the same patterns and integrate with the existing scene lifecycle.

## Goals / Non-Goals

**Goals:**
- Create a dedicated `LevelEditorScene.ts` for visual tile-based map editing
- Implement split-screen UI with palette (left 25%) and map canvas (right 75%)
- Support multi-layer editing (Ground, Objects/Collision)
- Enable seamless "Play" transition that passes map data to `GameScene`/`MainScene`
- Use Phaser's native tilemap APIs for efficient rendering and editing

**Non-Goals:**
- Persisting maps to disk/localStorage (future enhancement)
- Undo/redo functionality (out of scope for V1)
- Custom tileset loading UI (will use existing `assets/tileset.png`)
- Eraser tool or tile rotation (V1 uses simple paint-over)

## Decisions

### 1. Scene Architecture

**Decision:** Create `LevelEditorScene` as a standalone Phaser scene extending `Phaser.Scene`.

**Rationale:** Follows existing scene patterns (`MainScene`, `LevelUpScene`). Clean separation of concerns. Can be launched from a menu or dev console.

**Alternatives considered:**
- Embedding editor mode in `MainScene`: Rejected — adds complexity and coupling.

---

### 2. Dual Camera System

**Decision:** Use two Phaser cameras:
- `paletteCamera` (viewport: 0, 0, PALETTE_WIDTH, screenHeight) — views the tileset image
- `mapCamera` (viewport: PALETTE_WIDTH, 0, screenWidth - PALETTE_WIDTH, screenHeight) — views the editable tilemap

**Rationale:** Phaser's multi-camera system natively supports viewports with independent scroll positions. Using `camera.ignore()` keeps the palette elements separate from map elements cleanly.

**Alternatives considered:**
- HTML overlay for palette: Rejected — breaks Phaser integration and requires DOM syncing.
- Single camera with sprite masking: Rejected — more complex, less performant.

---

### 3. Tilemap Creation

**Decision:** Use `this.make.tilemap({ tileWidth, tileHeight, width, height })` to create a blank tilemap, then `map.createBlankLayer()` for Ground and Objects layers.

**Rationale:** Phaser's tilemap API is optimized for tile-based rendering. `putTileAt()` provides efficient single-tile updates during painting.

---

### 4. Tile Selection & Painting

**Decision:** 
- Click on palette → Calculate tile ID from click position and tileset columns → Store in `selectedTileId`
- Click/drag on map canvas → Call `layer.putTileAt(selectedTileId, tileX, tileY)` on the current layer

**Rationale:** Direct mapping from world coordinates to tile IDs is fast and intuitive.

---

### 5. Layer Switching

**Decision:** Use keyboard shortcuts (1 = Ground, 2 = Objects). Display current layer as fixed UI text.

**Rationale:** Simple and familiar from RPG Maker. No visual layer panel needed for V1.

---

### 6. Camera Controls

**Decision:**
- Map canvas: Arrow keys (via `SmoothedKeyControl`) for panning
- Palette: Drag-to-scroll with pointer (track `prevPosition.y` delta)

**Rationale:** Minimal key bindings. Arrow keys don't conflict with WASD (which could be added later for alternative panning).

---

### 7. Export & Play Transition

**Decision:** On 'P' key press:
1. Extract layer data (tile indices) from `layers[0]` and `layers[1]`
2. Call `this.scene.start('GameScene', { customMapData: { ... } })` to pass data
3. `GameScene` (or `MainScene`) will need to accept this data and render the custom map

**Rationale:** Keeps editor self-contained. Game scene interprets the data on init.

**Trade-off:** `MainScene` currently uses procedural background. Will need to conditionally use passed tilemap data instead. This is out of scope for the Level Editor change itself but noted as integration work.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Tileset not loaded when entering editor | Ensure `Preloader` always loads `assets/tileset.png`, or add `preload()` in `LevelEditorScene` |
| Large maps may lag during painting | Start with 50x50 map (1600x1600 px). Optimize later if needed. |
| Camera scroll bounds misconfigured | Set `camera.setBounds()` correctly for both cameras. Test edge cases. |
| Layer data structure incompatible with GameScene | Define clear data contract (2D array of tile IDs per layer). Document for future integration. |

## Data Contract for GameScene Integration

```typescript
interface CustomMapData {
  width: number;      // Tiles wide
  height: number;     // Tiles tall
  tileSize: number;   // Pixels per tile (32)
  ground: number[][];    // 2D array of tile IDs for ground layer
  objects: number[][];   // 2D array of tile IDs for objects layer
}
```

`MainScene` or a future `GameScene` will check for `customMapData` in init data and render accordingly.
