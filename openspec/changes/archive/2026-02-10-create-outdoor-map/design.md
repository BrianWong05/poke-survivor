## Context

<!-- Background and current state -->
The project requires a large outdoor map (300x300) for the game. Currently, maps are stored as JSON files in `src/assets/maps/` and loaded via an API. We need to generate this map procedurally because manual creation is infeasible for this size.

## Goals / Non-Goals

**Goals:**
<!-- What this design aims to achieve -->
- Create a Node.js script `scripts/generate_outdoor_map.ts` to generate map data.
- Generate a 300x300 map file at `src/assets/maps/outdoor.json`.
- Map content: Grass background, with procedural placement of Lakes (Water), Paths, Trees, Rocks, Flowers, and specific structures (Bridges, Buildings).
- Implement collision logic: Trees, Lakes, Rocks, Buildings must be marked as collidable.
- Use the `Outside.png` tileset.

**Non-Goals:**
<!-- What is explicitly out of scope -->
- Creating a general-purpose map editor (we are making a specific map generator).
- modifying the game engine (we are just adding an asset).

## Decisions

<!-- Key design decisions and rationale -->
1.  **Script-Based Generation**: We will use a standalone script to generate the JSON. This allows rapid iteration and handling of large data without bloating the repo with partial edits.
2.  **Map Format**: The output will match the `CustomMapData` interface:
    - `width: 300, height: 300`
    - `tileSize: 32` (assumed based on `test.json` and standard pixel art).
    - `layers`: We will use the new `layers` array format if supported, or fall back to `ground`/`objects` if `test.json` suggests legacy support is robust. `test.json` uses `ground` and `objects`. `map.ts` supports both. We will use `ground` for base terrain (Grass, Water, Path) and `objects` for overlays (Trees, Rocks, Buildings).
3.  **Tile IDs**: We will define constants at the top of the script for Tile IDs (e.g., `TILE_GRASS`, `TILE_WATER`). We will map these to the `Outside.png` tileset IDs found in `test.json` or placeholders if unknown.
    - *Assumption*: `id: 2` from `test.json` is likely Grass.
    - The script will allow easy swapping of IDs if they are incorrect.
4.  **Procedural Logic**:
    - **Base**: Fill with Grass.
    - **Lakes**: Use Cellular Automata or Perlin Noise to generate organic water shapes.
    - **Paths**: Random walkers or noise-based paths.
    - **Objects**: Scatter Trees and Rocks in non-path, non-water areas.

## Risks / Trade-offs

<!-- Known risks and trade-offs -->
- **Tile ID Mismatch**: Without a visual editor, guessed IDs might be wrong.
    - *Mitigation*: The script will have a configuration section for Tile IDs to easily correct them after visual inspection.
- **Performance**: 300x300 is 90,000 tiles. Client-side rendering might be slow.
    - *Mitigation*: The game engine's optimization is out of scope, but we assume it handles large maps (tiled rendering).
