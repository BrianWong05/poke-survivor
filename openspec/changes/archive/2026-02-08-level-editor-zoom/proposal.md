## Why

As maps get larger, it becomes difficult to view the entire layout or focus on specific details without constantly scrolling. Adding zoom functionality will improve navigation and usability, allowing creators to work on both high-level layout and fine details more efficiently.

## What Changes

- **Zoom Controls**: Add UI buttons/slider to control zoom level (e.g., 25% to 200%).
- **Mouse Interaction**: Support mouse wheel for zooming in/out.
- **Canvas Rendering**: Update `EditorCanvas` to scale rendering based on current zoom level.
- **Tool Logic**: Ensure painting, selection, and other tools coordinate correctly with the zoomed coordinates.

## Capabilities

### New Capabilities
- `level-editor-zoom`: Capabilities for controlling the view scale of the level editor map.

### Modified Capabilities
- `level-editor`: Update requirements to include zoom support as part of the core editor experience.

## Impact

- **Components**: `LevelEditor/index.tsx`, `LevelEditor/components/EditorCanvas.tsx`
- **Hooks**: `useMapState.ts` (to store zoom state)
- **UI**: New zoom control components in the sidebar or overlay.
