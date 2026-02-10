# Proposal: Generate Bridges Over Lakes

## Why

Currently, lakes act as solid barriers in the map. Adding bridges will create more interesting traversal options, allowing players to cross bodies of water and connecting different landmasses. This enriches the map layout and gameplay strategy.

## What Changes

- Add definitions for bridge tiles (horizontal, vertical, platforms) to `constants.ts`.
- Implement a new procedural generation module `bridges.ts` that detects suitable locations for bridges over lakes.
- Integrate the bridge generation step into the main `generateOutdoorMap` pipeline.
- Support multiple bridge variations:
    - Long Horizontal Bridge
    - Short Horizontal Bridge
    - Long Vertical Bridge
    - Short Vertical Bridge
    - Platforms

## Capabilities

### New Capabilities
- `bridge-generation`: Logic to procedurally place bridges over water, ensuring they connect valid ground points and utilize the correct tiles.

### Modified Capabilities
- `map-generation`: Update the main generation pipeline to include the bridge generation phase.

## Impact

- `scripts/map-gen/constants.ts`: New tile IDs.
- `scripts/map-gen/generators/bridges.ts`: New file.
- `scripts/generate_outdoor_map.ts`: Integration of new generator.
