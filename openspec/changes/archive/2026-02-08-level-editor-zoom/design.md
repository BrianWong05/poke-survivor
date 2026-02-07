## Context

The Level Editor currently displays the map at a 1:1 scale (1 tile = 32px). As users create larger maps (e.g., 50x50 or 100x100), navigating becomes cumbersome requiring excessive scrolling. The current `EditorCanvas` renders directly to a `<canvas>` element and handles mouse interactions by calculating grid coordinates from the bounding client rect.

## Goals / Non-Goals

**Goals:**
- Allow users to zoom in and out of the map (range: 50% to 200%).
- maintain correct mouse-to-grid coordinate mapping at any zoom level.
- Provide accessible UI controls for zooming.
- Support mouse wheel zooming (Ctrl+Wheel or similar standard pattern).

**Non-Goals:**
- Infinite zoom or vector-like scaling (pixel art style should be preserved).
- Minimap implementation (out of scope for now).

## Decisions

### 1. Zoom State Management
We will add `zoom` (number) state to `useMapState`. This allows the zoom level to be persisted or reset easily, and shared between the rendering canvas and the sidebar controls.
- **Default**: 1.0
- **Min**: 0.5
- **Max**: 2.0
- **Step**: 0.1

### 2. Canvas Rendering vs CSS Scaling
We will use **CSS Transform** (`transform: scale(N)`) on the canvas element.
*   **Why?**: modifying the internal render logic to scale every `drawTile` call adds complexity and potential performance overhead. CSS scaling leverages the browser's compositor and automatically handles the visual scaling.
*   **CSS Class**: `transform-origin-top-left` to ensure it stays anchored to the grid origin.

### 3. Mouse Coordinate Correction
Since `getBoundingClientRect()` returns the *visual* (scaled) dimensions, we need to adjust the coordinate calculation in `EditorCanvas`:
```typescript
const x = Math.floor(((e.clientX - rect.left) / zoom) / TILE_SIZE);
```
This ensures that clicking a "visually large" tile correctly maps to its logical grid coordinates.

### 4. Persistence
Zoom level does not need to be persisted to disk (saved maps). It is a session-based view preference.

## Risks / Trade-offs

**Risk: Blurry Textures**
Scaling up images via CSS can cause blurring.
*   **Mitigation**: Ensure `image-rendering: pixelated` (Tailwind `antialiased` or custom class) is applied to the canvas. (Already present in `EditorCanvas`).

**Risk: Event Handling Mismatch**
If the zoom logic is applied inconsistently (visuals but not events), tools will paint in the wrong place.
*   **Mitigation**: Centralize the coordinate mapping logic or update `EditorCanvas` carefully to use the passed `zoom` prop in `handleMouseDown` and `handleMouseMove`.

