## Why

<!-- Explain the motivation for this change. What problem does this solve? Why now? -->
The user wants to add a large (300x300) outdoor map to the game, featuring diverse terrain (grass, paths, trees, lakes, bridges, rocks, flowers, buildings) and specific collision rules. Creating such a large map manually is impractical, so we will implement a procedural generation script to produce the map data file.

## What Changes

<!-- Describe what will change. Be specific about new capabilities, modifications, or removals. -->
1.  **New Map Generation Script**: Create `scripts/generate_outdoor_map.ts` to procedurally generate the map JSON.
2.  **New Map Asset**: Generate `src/assets/maps/outdoor.json` (300x300 tiles) using the `Outside.png` tileset.
3.  **Tile ID Definitions**: Define a mapping of terrain types (Grass, Water, Path, Tree, etc.) to specific tile IDs from `Outside.png` to ensure correct visual representation and collision logic.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `map-gen`: Defines the logic and rules for generating procedural map content including terrain types and collision layers.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
