## Context

The Level Editor has a Brush Tool that allows painting tiles by dragging. Currently, the tiles painted via dragging do not update their auto-tile bitmasks, meaning they look like isolated tiles instead of connecting to neighbors. Single clicks work correctly, suggesting the brush tool implementation bypasses the necessary update logic.

## Goals / Non-Goals

**Goals:**
- Fix the brush tool to trigger auto-tile updates for every painted tile.
- Ensure visual consistency between single-click placement and drag-painting.

**Non-Goals:**
- rewriting the entire level editor rendering pipeline.

## Decisions

### Reuse `placeTile` Logic
The brush tool should reuse the existing logic that handles auto-tiling (likely `placeTile` or a similar method that calls `updateTileWithNeighbors`), instead of potentially just setting the tile index directly in the map data. This ensures consistent behavior.

## Risks / Trade-offs

- **Performance**: Calling neighbor updates on every frame/mouse move during a drag could be expensive if the update logic is slow.
  - *Mitigation*: The current map size and 2D nature should be performant enough. If lag occurs, we can implement debouncing or batch updates (update only changed tiles at the end of the frame).
