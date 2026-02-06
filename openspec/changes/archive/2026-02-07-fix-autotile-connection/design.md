## Context

The `AutoTileGenerator.ts` handles creating 47-tile bitmask sets from a packed tileset (like `Dirt.png`).
Currently, the "Centre" tile logic in `drawQuad` correctly identifies when a tile is connected on all 4 sides (vert & horiz) but missing a diagonal neighbor (the "Inner Corner" case).
However, it currently reuses the "Outer Corner" source tiles (e.g., top-left of the source image) for this case. This looks correct for some tilesets but incorrect for the `Dirt.png` style tileset where a dedicated "Inner Corner" tile exists.

## Goals / Non-Goals

**Goals:**
- Update `AutoTileGenerator` to use the correct source tile for Inner Corners.
- Ensure the center of a "Cross" intersection renders with 4 inner corners (creating a proper intersection visual) instead of a solid block.

**Non-Goals:**
- Refactoring the entire auto-tile system.
- Changing the 47-tile logic layout.

## Decisions

### 1. Source Tile Mapping
We will define a new source coordinate `INNER_CORNER` at `x: 4, y: 0` in `AutoTileGenerator.SRC`.
This corresponds to the isolated tile at the top-right of the `Dirt.png` tileset as identified in requirements.

### 2. Rendering Logic
In `drawQuad`, when the condition `vert && horiz && !diag` is met (meaning we are connected orthogonally but missing the diagonal neighbor), we will use `INNER_CORNER` instead of the current fallback to `TL/TR/BL/BR_CORNER`.
This logic must be applied specifically to the quadrants to ensure the correct orientation (though the inner corner source tile is usually symmetrical or rotationally consistent for this specific style, we map it to the respective quadrant). The requirement says "don't use the solid Center tile. Instead, draw the corresponding quadrant from the Top-Right isolated source tile".
Since `x:4, y:0` is a single tile, we treat it as a source for the quadrants.
- If quad is TL, we draw the TL of `INNER_CORNER`.
- If quad is TR, we draw the TR of `INNER_CORNER`, etc.
This matches the existing logic structure where we select a `src` point and then add offsets for sub-quadrants.

## Risks / Trade-offs

**Risks:**
- If other tilesets do not have an inner corner at `x:4, y:0`, this change might break them.
- *Mitigation:* The requirement implies we are specifically tuning for `Dirt.png` or this format. If this `AutoTileGenerator` is generic, we should verify if this standard applies to others. However, given the scope is a specific visual bug fix, we assume the current asset pipeline expects this format.

**Trade-offs:**
- Hardcoding `x:4, y:0` assumes a specific tileset layout.
