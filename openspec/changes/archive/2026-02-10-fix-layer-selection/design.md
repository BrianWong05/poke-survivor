## Context

The `LayerPanel` currently uses `dnd-kit`'s default `PointerSensor` which captures all pointer down events as potential drags. This prevents `onClick` handlers on the `SortableLayerItem` from firing, making layer selection via click impossible.

## Goals / Non-Goals

**Goals:**
- Restore the ability to select a layer by clicking on it.
- Maintain the ability to reorder layers via drag-and-drop.
- Ensure the solution works for both mouse and touch inputs (via PointerSensor).

**Non-Goals:**
- Refactoring the entire layer management state or UI beyond this fix.
- Changing the visual style of the layer items (except for necessary cursor feedback).

## Decisions

- **Use Activation Constraint:** We will configure the `PointerSensor` with an `activationConstraint` of distance: 8 pixels. This communicates to `dnd-kit` that a gesture should only be interpreted as a drag if the pointer moves at least 8 pixels. Movements smaller than this will be treated as clicks, allowing the `onClick` event to propagate.

## Risks / Trade-offs

- **Drag Latency:** There will be a slight perceptible delay/threshold before a drag starts (the user must move 8px). This is a standard pattern in drag-and-drop interfaces to distinguish clicks from drags and is generally acceptable.
