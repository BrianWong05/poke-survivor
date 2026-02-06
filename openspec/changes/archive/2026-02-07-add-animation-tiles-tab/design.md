## Context

The Level Editor is the primary tool for building game maps. Currently, it allows selecting standard tiles and autotiles. With the introduction of the `tile-animation-system`, there are now animated assets available for use. However, these are not easily accessible in the current editor UI, making it difficult for designers to place them on the map.

## Goals / Non-Goals

**Goals:**
- integrate a new "Animation" tab into the Level Editor's tile selection pane.
- Display a list of available animated tiles derived from the game's data registry.
- Allow users to select an animation and place it on the map (painting).
- Render a preview of the animation in the selection pane (if feasible) or at least a representative frame.

**Non-Goals:**
- Creating new animations (this is a consumption tool, not a creation tool).
- Editing animation properties (speed, frames) from the Level Editor (this should remain in code/config).

## Decisions

### Data Source
We will source the list of available animations from the `GameData` or the central registry used by `tile-animation-system`. This ensures the editor is always in sync with the game's actual capabilities.

### UI Structure
We will extend the existing tab/mode switching mechanism in the `TileSelector` (or equivalent component). If a generic tab component exists, we use it; otherwise, we implement a simple switcher consistent with the current "Tiles" vs "Autotiles" toggle.

### Preview Rendering
To verify the correct animation is selected, the UI should ideally play the animation. We will attempt to render the animated sprite using the same logic as the game loop (or a simplified React-based frame cycler) within the selector buttons. If performance becomes an issue with many animations, we will fallback to displaying the first frame with a "hover to play" behavior.

## Risks / Trade-offs

- **Performance:** Rendering many animated sprites in the DOM/Canvas UI simultaneously could be heavy.
  - *Mitigation:* Implement pagination or virtualization if the list grows large. Use CSS-based sprite sheet animation where possible for cheaper rendering.
- **Complexity:** The map rendering system needs to know how to render these placed animations.
  - *Mitigation:* Ensure the `level-editor` places the correct data ID that the `GameCanvas` or renderer already understands (i.e., we are just injecting the ID, the renderer handles the rest).
