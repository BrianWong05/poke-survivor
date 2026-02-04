## 1. Scene Setup

- [x] 1.1 Create `src/game/scenes/LevelEditorScene/index.ts` with basic scene structure (constructor, preload, create, update)
- [x] 1.2 Register `LevelEditorScene` in the Phaser game config
- [x] 1.3 Ensure tileset is loaded in `preload()` (using `assets/Tilesets/Outside.png`)

## 2. Tilemap & Layers

- [x] 2.1 Create a blank 50x50 tilemap with 32x32 tile size using `this.make.tilemap()`
- [x] 2.2 Add tileset image to the map with `map.addTilesetImage()`
- [x] 2.3 Create Ground layer (index 0) using `map.createBlankLayer()`
- [x] 2.4 Create Objects layer (index 1) using `map.createBlankLayer()`
- [x] 2.5 Fill Ground layer with tile ID 0 (default)

## 3. Dual Camera System

- [x] 3.1 Configure main camera (mapCamera) viewport to right 75% of screen
- [x] 3.2 Set mapCamera bounds to tilemap dimensions
- [x] 3.3 Create palette as a fixed UI container (not using separate camera)
- [x] 3.4 Create palette tile grid with scrollable behavior
- [x] 3.5 Configure camera ignores (mapCamera ignores palette elements)

## 4. Palette UI

- [x] 4.1 Create palette tile grid from tileset frames at origin (0,0)
- [x] 4.2 Create paletteSelectionMarker Graphics with red stroke for selected tile
- [x] 4.3 Implement palette drag-to-scroll in `onPointerMove`

## 5. Tile Selection

- [x] 5.1 Detect clicks within palette area in `onPointerDown`
- [x] 5.2 Calculate tile index from click position using bounds checking
- [x] 5.3 Store `selectedTileId` from tile click
- [x] 5.4 Position paletteSelectionMarker over the selected tile

## 6. Tile Painting

- [x] 6.1 Create map marker Graphics with green stroke for mouse position
- [x] 6.2 Update marker position in `update()` based on mouse world position
- [x] 6.3 Implement single-click painting in `onPointerDown` for map area
- [x] 6.4 Implement drag painting using `isDrawing` flag in `update()`
- [x] 6.5 Call `layer.putTileAt(selectedTileId, x, y)` on current layer

## 7. Layer Switching

- [x] 7.1 Add keyboard listener for '1' key to set `currentLayerIndex = 0`
- [x] 7.2 Add keyboard listener for '2' key to set `currentLayerIndex = 1`
- [x] 7.3 Add fixed UI text element showing current layer name
- [x] 7.4 Update UI text when layer is switched

## 8. Camera Controls

- [x] 8.1 Create SmoothedKeyControl for arrow key map panning
- [x] 8.2 Call `controls.update(delta)` in scene update loop

## 9. Export & Play

- [x] 9.1 Add keyboard listener for 'P' key to trigger export
- [x] 9.2 Extract tile data from Ground and Objects layers
- [x] 9.3 Structure data as `CustomMapData` interface (width, height, tileSize, ground[][], objects[][])
- [x] 9.4 Call `this.scene.start('MainScene', { customMapData })` to launch game

## 10. Helper UI

- [x] 10.1 Add helper text showing controls (Arrow Keys: Pan | 1/2: Layer | Click: Paint | P: Play)
- [x] 10.2 Set helper text scroll factor to 0 (fixed to screen)
- [x] 10.3 Set helper text depth to ensure visibility

## 11. Integration (Pending)

- [x] 11.1 Add entry point to access Level Editor (e.g., from title screen or dev menu)
- [ ] 11.2 Update MainScene to accept and render `customMapData` if provided
