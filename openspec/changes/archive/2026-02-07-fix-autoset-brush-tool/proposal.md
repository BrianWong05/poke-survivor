## Why

The "Recursive Updates" requirement of the Auto-Tile System is currently failing when using the Level Editor's Brush Tool. While single tile placement works, the brush tool (dragging) does not consistently trigger neighbor updates, leading to disjointed tile visuals. This breaks the visual coherence of the map editing process.

## What Changes

- Update the Brush Tool interaction handler in the Level Editor to ensuring it triggers the auto-tile update logic for every painted tile.
- Ensure that neighbor updates are correctly propagated when multiple tiles are placed in rapid succession (dragging).

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- `src/components/LevelEditor/` (Brush tool logic)
- `src/systems/AutoTileSystem` (if integration needs adjustment)
