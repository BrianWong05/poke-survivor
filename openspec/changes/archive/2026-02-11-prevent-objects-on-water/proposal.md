# Proposal: Prevent Objects on Water and Bridges

## Why

Currently, trees and flowers can spawn on water tiles and bridges. This happens because the object generation logic only checks the ground layer (grass) and ignores the water and bridge layers which are rendered on top. This results in visual oddities and gameplay issues where obstacles (trees) block bridges or appear in the middle of lakes.

## What Changes

We will modify the map generation process to make object and decoration placement aware of the water and bridge layers.

- `generateObjects` will accept `waterTiles` and `bridgeTiles` as arguments and verify that a target tile is not water or a bridge before placing a tree.
- `generateFlowers` will accept `waterTiles` and `bridgeTiles` as arguments and verify that a target tile is not water or a bridge before placing a flower.
- `generateOutdoorMap` will be updated to pass these layers to the generator functions.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `smart-object-placement`: Logic to ensure map objects respect all terrain layers (water, bridges) during generation.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **Map Generation**: `scripts/generate_outdoor_map.ts`, `scripts/map-gen/generators/objects.ts`, `scripts/map-gen/generators/decorations.ts`.
- **Gameplay**: Maps will no longer have trees blocking bridges or floating on water.
