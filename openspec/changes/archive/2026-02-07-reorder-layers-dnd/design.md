## Context

The current `LayerPanel` in the Level Editor allows layer reordering only through incremental "Up" and "Down" buttons. This design documents the implementation of a more intuitive drag-and-drop (DnD) interface for reordering layers.

## Goals / Non-Goals

**Goals:**
- Enable users to reorder layers by dragging and dropping them in the `LayerPanel`.
- Maintain existing button-based reordering for accessibility and alternative input.
- Keep the implementation simple and dependency-free.

**Non-Goals:**
- Dragging tiles between layers.
- Dragging items out of the sidebar.
- Multi-layer selection or dragging.

## Decisions

### 1. Use Native HTML5 Drag and Drop API
- **Rationale**: Avoids adding new dependencies like `dnd-kit` or `react-beautiful-dnd` to a relatively simple project. Native DnD is supported by all modern browsers and is sufficient for a simple list reordering.
- **Alternatives**: 
  - `dnd-kit`: More flexible and better touch support, but adds bundle size and complexity.
  - `react-beautiful-dnd`: Powerful but heavy and currently in maintenance mode.

### 2. Move Logic to `useMapState`
- **Decision**: Add a `moveLayer(id: string, toIndex: number)` function to the `useMapState` hook.
- **Rationale**: Reordering is a core state operation that should be centralized. Moving to an arbitrary index is a more general operation than `reorderLayer('up'|'down')`.

### 3. Visual Feedback
- **Decision**: Use `draggable="true"` on layer rows. Use `onDragStart`, `onDragOver`, and `onDrop` events.
- **Implementation**: 
  - `onDragStart`: Store the ID of the dragged layer.
  - `onDragOver`: Prevent default to allow dropping.
  - `onDrop`: Calculate the target index and call `moveLayer`.

## Risks / Trade-offs

- [Risk] Native DnD lacks good touch support by default. → [Mitigation] The Level Editor is primarily a desktop tool. If mobile support becomes a priority, we can swap the implementation for a touch-friendly library later.
- [Risk] Index calculation during reversed list rendering can be confusing. → [Mitigation] Carefully map the UI index (reversed) back to the state index (normal) during move operations.
