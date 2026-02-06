## Why

To enhance the level creation process by providing a dedicated interface for selecting and placing animated tiles. This allows level designers to easily access and utilize dynamic tile elements (such as water, conveyer belts, or environmental effects) without mixing them with static tiles or autotiles.

## What Changes

- Add a new "Animation" tab to the Tile Selector component in the Level Editor.
- Implement the logic to fetch and display available animated tiles within this new tab.
- Ensure selecting an animation tile allows painting it onto the map similarly to other tiles.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `animation-tile-ui`: The user interface components and logic specifically for browsing and selecting animated tiles.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `level-editor`: Updating the level editor's tile selection requirements to include the new animation tab and its functionality.

## Impact

- **Code:** `src/components/LevelEditor/`, `src/features/DevConsole/` (if related to debug tools), and potentially map rendering logic to preview animations.
- **Systems:** Interactions with `tile-animation-system` to retrieve tile data.
