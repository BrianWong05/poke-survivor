## Context

The current `TileAnimator` tightly couples timer updates with layer iteration. When multiple layers are animated (e.g., ground and objects), the `update` method is called for each layer, causing the internal timers to advance multiple times per frame. This results in animations running faster than intended. Additionally, the Level Editor initializes animations with hardcoded values instead of using the central `TILE_ANIMATIONS` config.

## Goals / Non-Goals

**Goals:**
- Fix the multi-layer timing bug by decoupling timer updates from layer application.
- Centralize animation configuration to `src/game/config/TileAnimations.ts`.
- Ensure the `AnimationSelector` UI is correctly styled without Tailwind.

**Non-Goals:**
- Adding new animations (except verifying existing ones work).
- Changing the underlying Phaser tilemap system.

## Decisions

### 1. Split `update` into `preUpdate` and `updateLayer`
- **Decision**: Refactor `TileAnimator` to have two methods:
  - `preUpdate(delta: number)`: Advances all animation timers. Called once per frame by the scene or manager.
  - `updateLayer(layer: Phaser.Tilemaps.TilemapLayer)`: Applies the current frame of each animation to the specified layer. Called for each layer.
- **Rationale**: This separation ensures that `delta` is applied exactly once per frame, regardless of how many layers are being animated.

### 2. Centralize Animation Registration
- **Decision**: Remove manual `addAnimation` calls in `LevelEditorScene.ts`. Instead, import `TILE_ANIMATIONS` and iterate over it to register animations, similar to `MapManager.ts`.
- **Rationale**: Prevents configuration drift and ensures consistent animation behavior across the game and editor.

### 3. UI Styling
- **Decision**: Review `AnimationSelector.tsx` to ensure it uses BEM-like class names (e.g., `.animation-selector__item`) or consistent standard CSS classes defined in `src/components/LevelEditor/styles.css`.
- **Rationale**: Maintains consistency with the project's styling guidelines (standard CSS, no Tailwind).

## Risks / Trade-offs

- [Risk] Breaking existing maps if animation IDs change. → [Mitigation] The `TILE_ANIMATIONS` config uses relative IDs (`startId`), but we must ensure the mapping logic in `TileAnimator` correctly resolves global IDs (GIDs) from tilesets.

## Open Questions

- Does `AnimationSelector` need to handle multiple tilesets? The current implementation seems to assume a single active asset or handles them individually. The design will respect the current "active asset" pattern.
