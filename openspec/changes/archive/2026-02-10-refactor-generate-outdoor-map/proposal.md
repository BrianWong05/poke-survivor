## Why

The `scripts/generate_outdoor_map.ts` script has grown to over 900 lines of code, containing mixed concerns including type definitions, constants, utility functions, and complex procedural generation logic. This makes the script difficult to read, maintain, and extend. Refactoring it into atomic modules will improve code organization and developer experience.

## What Changes

I will refactor `scripts/generate_outdoor_map.ts` into a modular structure:
1.  **Extract Types**: Move interfaces to `scripts/map-gen/types.ts`.
2.  **Extract Constants**: Move configuration and tile IDs to `scripts/map-gen/constants.ts`.
3.  **Create Utils**: Move helper functions (random, geometry, auto-tiling) to `scripts/map-gen/utils/`.
4.  **Modular Generators**: Create specific generators for different map features (Water, Paths, Objects) in `scripts/map-gen/generators/`.
5.  **Main Orchestrator**: Update `scripts/generate_outdoor_map.ts` to coordinate these modules.

## Capabilities

### New Capabilities

- `map-generation`: Defines the requirements and logic for procedural outdoor map generation, including terrain features (lakes, dirt), paths (BSP/A*), and object placement (trees).

### Modified Capabilities

- None
