## Why

The Level Editor currently supports only two hard-coded layers (Ground and Objects). This rigid architecture prevents creators from building maps with multiple overlapping terrain features, decorative layers, or more granular collision zones. A flexible layer system is needed to unlock richer map composition.

## What Changes

- **Dynamic layer management**: Users can add, remove, rename, and reorder layers instead of being limited to the fixed Ground/Objects pair
- **Layer visibility toggles**: Each layer can be shown/hidden in the editor to focus on specific content
- **Layer properties**: Each layer has configurable properties (name, visibility, collision flag, depth/z-index)
- **Backward-compatible data format**: The `CustomMapData` interface evolves to support a `layers` array while remaining compatible with existing saved maps that use `ground`/`objects` fields
- **Updated game integration**: `MapManager` consumes the new multi-layer format and creates Phaser layers accordingly
- **Updated undo/redo**: History system captures the full layer collection state

## Capabilities

### New Capabilities
- `editor-layers`: Dynamic layer management system for the Level Editor — add, remove, rename, reorder, toggle visibility, and configure properties per layer

### Modified Capabilities
- `level-editor`: Multi-Layer Editing requirement changes from two fixed layers to a dynamic layer collection with configurable properties

## Impact

- **Types**: `CustomMapData`, `TileData[][]` layer references, `EditorState`, `LayerType` all change
- **State management**: `useMapState` refactored from separate `groundLayer`/`objectLayer` state to a unified `layers` array
- **UI**: `EditorSidebar` layer buttons replaced with a dynamic layer panel
- **Canvas rendering**: `EditorCanvas` iterates over the ordered layer array
- **Persistence**: `mapCompression.ts` updated for multi-layer serialization; backward-compatible deserialization for legacy two-layer format
- **Game runtime**: `MapManager.createCustomMap` updated to create Phaser layers from the new data structure
- **Save/Load API**: No API changes needed — same JSON endpoints, different payload shape
