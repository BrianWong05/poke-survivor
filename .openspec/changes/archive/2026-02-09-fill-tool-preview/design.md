## Context

The Level Editor currently provides a "Fill" tool that allows users to quickly place tiles over a rectangular area. However, the visual feedback during the drag operation is limited to a simple white rectangular outline. This makes it difficult for users to visualize the final result, especially when using complex patterns or multi-tile selections in the brush.

## Goals / Non-Goals

**Goals:**
- Provide immediate visual feedback of the tiles that will be placed by the Fill tool.
- Ensure the preview accurately reflects the tiling pattern (repetition) that will occur upon release.
- Maintain the existing selection boundary outline for clarity.
- Render the preview with semi-transparency to distinguish it from placed tiles.

**Non-Goals:**
- Changing the underlying logic of how tiles are placed or data is stored.
- Adding new fill modes (e.g., flood fill).

## Decisions

### Rendering Approach
We will modify the `EditorCanvas` component's `render` loop. When the active tool is `fill` and the user is dragging:
1.  Calculate the drag bounds (min/max X and Y).
2.  Iterate through the tiles within these bounds.
3.  For each position, calculate the correct source tile from the selected asset (handling pattern repetition).
4.  Draw the tile using `ctx.globalAlpha` (e.g., 0.5) to indicate preview status.
5.  Draw the selection rectangle outline on top.

### Performance
We will rely on the existing HTML5 Canvas 2D API. Drawing a few hundred semi-transparent tiles every frame during a drag operation should be performant enough for the target map sizes (typically < 100x100).

## Risks / Trade-offs

- **Performance**: Very large fill areas on low-end devices might cause frame drops during the drag.
- **Visual Clutter**: On complex maps, a semi-transparent preview might be hard to distinguish from the background if the background is similar. The outline will help mitigate this.
