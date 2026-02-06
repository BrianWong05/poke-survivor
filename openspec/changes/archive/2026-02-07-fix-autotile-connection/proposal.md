## Why

The current auto-tiler has a visual bug where the center of a "Cross" path (intersection) renders as a solid square instead of a proper intersection. This decreases the visual quality and immersion of the game.

## What Changes

Update `AutoTileGenerator.ts` to correctly identify and render "Inner Corner" tiles effectively creating a proper intersection graphic when paths cross. Specifically, we will correctly map the Top-Right "Inner Corner" tile from the `Dirt.png` tileset to the center quadrant when diagonal neighbors are missing but cardinal neighbors exist.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `autotile-system`: Update rendering logic to support inner corner intersections for cross paths.
