# Design: Go to Spawn Point

## Context
The level editor has a "Spawn" tool used to set the player's starting position. The UI features a scrollable canvas area. For large maps (e.g., 300x300), finding the spawn point manually can be slow.

## Goals
- Provide a quick shortcut to center the view on the spawn point.
- Implement this shortcut as a double-click on the "Spawn" tool button.

## Decisions

### Double-Click Event Handling
- We will add an `onDoubleClick` handler to the `ToolCard` component in `EditorSidebar.tsx`.
- The `EditorSidebar` will expose an `onToolDoubleClick` callback prop.

### Centering Logic
- The `LevelEditor` component manages the scrollable `canvasArea`.
- We will use a `useRef` to capture the `canvasArea` element.
- The `handleToolDoubleClick` will calculate the target scroll position:
  - `targetX = (spawnPoint.x + 0.5) * TILE_SIZE * zoom`
  - `targetY = (spawnPoint.y + 0.5) * TILE_SIZE * zoom`
  - `scrollLeft = targetX - viewportWidth / 2`
  - `scrollTop = targetY - viewportHeight / 2`
- We will use `element.scrollTo({ ..., behavior: 'smooth' })` for a better user experience.

### Offset Considerations
- The `canvasArea` has `padding: 40px` and `place-items: center`.
- If the map is smaller than the viewport, it's centered automatically. `scrollTo` on the container will only have an effect if the content is larger than the viewport (scrollable).
- The `EditorCanvas` is the only child of `canvasArea`.

## Risks / Trade-offs
- **Redundant scrolls**: If the spawn point is already visible/centered, the scroll might still trigger but will be a no-op or a small adjustment. `smooth` behavior mitigates jitter.
- **No spawn point**: If no spawn point is set, the double-click should probably do nothing or show a subtle hint (out of scope for now, just do nothing).
