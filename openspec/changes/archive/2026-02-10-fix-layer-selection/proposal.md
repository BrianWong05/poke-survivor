## Why

The current implementation of `LayerPanel` uses `dnd-kit` for drag-and-drop reordering of layers. However, the default `PointerSensor` configuration interprets any pointer down event as the potential start of a drag operation. This prevents `onClick` events from firing reliably on the layer items, making it impossible (or very difficult) for users to select a layer by clicking on it.

## What Changes

I will update the `useSensor` configuration in `src/components/LevelEditor/components/LayerPanel.tsx` to add an `activationConstraint` to the `PointerSensor`. I will require a minimum movement of 8 pixels before a drag operation is considered active. This will allow standard clicks (which typically involve little to no movement) to propagate as `onClick` events to the layer item, restoring the ability to select layers.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

This change solely affects the `LayerPanel` component and its interaction handling. It does not introduce new dependencies or impact other systems.
