## Why

The current "Brush" tool in the Level Editor behaves more like a smart fill or recursive placement tool (especially with Autotiles), which can be confusing and makes precise single-tile editing difficult. Separating this behavior into a dedicated "Fill" tool and introducing a standard single-tile "Brush" tool will improve the map editing workflow and precision.

## What Changes

- Rename the existing "Brush" tool logic and UI to "Fill" (preserving its current recursive/autoset capabilities).
- Create a new "Brush" tool that strictly places a single tile at the cursor position (supporting both standard and autotile tilesets without recursive expansion).
- Update the `LevelEditor` UI to include both "Brush" and "Fill" options in the toolbar.
- Update keyboard shortcuts or tool cycling if applicable.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `level-editor`: Update requirements to distinguish between Brush (single) and Fill (recursive/smart) tools.

## Impact

- **Code**: `src/components/LevelEditor/index.tsx`, `src/components/LevelEditor/utils.ts`.
- **UI**: Level Editor toolbar will have an additional button.
