## 1. Level Editor UI Updates

- [x] 1.1 Add state for `activeTab` (Tiles vs Animations) in Level Editor.
- [x] 1.2 Create Tab navigation UI in the palette area.
- [x] 1.3 Refactor existing tileset view to only show when "Tiles" tab is active.

## 2. Animation Data Integration

- [x] 2.1 Identify source of animation definitions (likely `GameData` or `TileAnimationSystem`).
- [x] 2.2 Create a utility or hook to fetch available animation tiles.

## 3. Animation Tab Implementation

- [x] 3.1 Create `AnimationSelector` component.
- [x] 3.2 Implement grid rendering of available animations.
- [x] 3.3 Add selection logic (click to set `selectedTileId`).
- [x] 3.4 Implement preview for items (static frame or simple loop).

## 4. Integration & Testing

- [x] 4.1 Ensure selecting an animation works with existing painting logic.
- [x] 4.2 Verify map saving/loading preserves animation tile IDs.
