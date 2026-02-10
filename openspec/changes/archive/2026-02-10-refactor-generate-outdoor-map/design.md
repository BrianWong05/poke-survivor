## Context

The current `scripts/generate_outdoor_map.ts` is a monolithic script that handles all aspects of map generation, including type definitions, constants, utility functions, and feature-specific generation logic. This makes it hard to navigate and maintain.

## Goals / Non-Goals

**Goals:**
-   Break down `generate_outdoor_map.ts` into smaller, focused modules.
-   Create a clear directory structure for map generation logic (`scripts/map-gen/`).
-   Improve readability and maintainability of the map generation code.
-   Ensure the generated map output remains consistent with the original logic.

**Non-Goals:**
-   Changing the fundamental map generation algorithms or visual style.
-   Adding new map features or biomes (this is a strict refactor).

## Decisions

-   **Directory Structure**: All new modules will reside in `scripts/map-gen/`.
-   **State Management**: The map state (tiles, palette) will be passed to generator functions rather than using a global singleton, to allow for easier testing and potential parallelization in the future.
-   **Module Breakdown**:
    -   `types.ts`: Shared interfaces (`TileData`, `CustomMapData`, `SerializedLayer`).
    -   `constants.ts`: Configuration values (`MAP_WIDTH`, `TILE_SIZE`, `TILE_IDS`).
    -   `utils/`: Helper functions.
        -   `auto-tile.ts`: Auto-tile logic and bitmask tables.
        -   `common.ts`: Random number generators and basic geometry helpers.
    -   `generators/`: Feature-specific logic.
        -   `water.ts`: Lake generation and smoothing.
        -   `ground.ts`: Dirt patch generation and auto-tiling resolution.
        -   `paths.ts`: BSP and A* pathfinding logic.
        -   `objects.ts`: Tree and object placement.
    -   `index.ts` (or main script): Orchestrates the generation process.

## Risks / Trade-offs

-   **State Passing**: Passing large arrays (like the map grid) around might slightly impact performance if not handled by reference (which JS does by default for objects/arrays, so this is minimal risk).
-   **Complexity**: Introducing multiple files increases the file count, but the benefit of separation of concerns outweighs this.
