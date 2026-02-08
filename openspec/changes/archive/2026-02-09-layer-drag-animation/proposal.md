# Proposal: Layer Drag Animation

## Why

The current layer management in the Level Editor uses native HTML5 Drag and Drop which provides minimal visual feedback. Users only see a ghost image of the dragged element, and list items do not reorder visually until the drop occurs. This makes it difficult to know exactly where a layer will be placed, leading to a poor user experience.

Adding a proper drag animation with smooth reordering visualization will make the interface feel more polished and responsive, giving users confidence in their actions.

## What Changes

I will replace the native HTML5 Drag and Drop implementation in `LayerPanel.tsx` with `@dnd-kit`. This will provide:
- Smooth animations when sorting layers.
- A clear drag overlay that follows the cursor.
- Visual cues for the drop position.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->
- `drag-n-drop`: Implements smooth drag-and-drop interactions for list reordering using dnd-kit.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `level-editor`: The layer management behavior is being refined.

## Impact

<!-- Affected code, APIs, dependencies, systems -->
- **Dependencies**: Adds `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
- **Components**: heavily refactors `LayerPanel.tsx` to use `SortableContext` and `useSortable`.
- **Styling**: `LayerPanel.module.css` will need updates to support the drag overlay and transition states.
