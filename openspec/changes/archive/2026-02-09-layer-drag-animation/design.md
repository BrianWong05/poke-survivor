# Design: Layer Drag Animation

## Context

Currently, the `LayerPanel` component uses the native HTML5 Drag and Drop API. This API is limited in terms of styling and customization. The visual feedback is restricted to a ghost image of the dragged element, and there is no live reordering of the list items as the user drags. This lack of feedback makes the layer reordering process feel clunky and precise positioning difficult.

## Goals / Non-Goals

**Goals:**
- Implement smooth, animated reordering of layers in the `LayerPanel`.
- Provide a custom drag overlay that clearly shows what is being dragged.
- Maintain existing functionality: selecting, hiding, locking, and deleting layers.
- Ensure the new implementation is accessible and performant.

**Non-Goals:**
- Reimplementing drag-and-drop for other parts of the application (e.g., map editor canvas) at this time.
- Changing the underlying data structure of layers (just the UI interaction).

## Decisions

### Use `@dnd-kit`
I have chosen to use `@dnd-kit` over other libraries or a custom implementation for the following reasons:
- **Modularity:** It provides small, focused packages (`core`, `sortable`, `utilities`) so we only pay for what we use.
- **Accessibility:** It has excellent built-in keyboard support and screen reader integration.
- **Customization:** It allows for complete control over the drag overlay and animations, which is the primary goal of this change.
- **Modern React:** It uses hooks and context, fitting perfectly with the current React codebase.

### Integration Strategy
1.  **Wrap `LayerPanel` list in `DndContext` and `SortableContext`**: This will establish the drag-and-drop area.
2.  **Create a `SortableLayerItem` component**: This will wrap the existing layer item rendering logic. It will use the `useSortable` hook to handle drag gestures and transform styles.
3.  **Drag Overlay**: I will use `<DragOverlay>` to render a semi-transparent clone of the layer being dragged. This ensures the user always sees what they are moving, independent of the list.
4.  **Event Handling**:
    - `onDragStart`: Track the active item for the overlay.
    - `onDragEnd`: Calculate the new index and call `onMoveLayer` if the position changed.

### Visual Design
- **Dragging Item**: The item in the list will have its opacity reduced (or be hidden) to indicate it's being moved.
- **Overlay**: The overlay will be slightly elevated (shadow) and follow the cursor.
- **Reordering**: Other items will smoothly slide out of the way using CSS transitions (provided by `@dnd-kit/sortable`).

## Risks / Trade-offs

- **Bundle Size**: Adding a library increases bundle size slightly (approx 10kb gzipped for dnd-kit core+sortable). This is acceptable for the improved UX.
- **Complexity**: The component code will be slightly more complex than the native implementation, requiring state management for the active drag item.
