## 1. World Setup

- [x] 1.1 Define map constants (mapWidth = 3200, mapHeight = 3200) at the start of create()
- [x] 1.2 Set physics world bounds to (0, 0, mapWidth, mapHeight)

## 2. Background Creation

- [x] 2.1 Create procedural grid texture using make.graphics (64x64, forest green fill with dark green border)
- [x] 2.2 Generate texture with key 'grid_bg'
- [x] 2.3 Add TileSprite centered at (mapWidth/2, mapHeight/2) spanning full world dimensions

## 3. Player Positioning

- [x] 3.1 Update player spawn position to world center (mapWidth/2, mapHeight/2 = 1600, 1600)
- [x] 3.2 Ensure player collides with world bounds

## 4. Camera Configuration

- [x] 4.1 Set camera bounds to match world bounds (0, 0, mapWidth, mapHeight)
- [x] 4.2 Configure camera to follow player with smooth lerp (0.1, 0.1)

## 5. Verification

- [x] 5.1 Test player can move freely across the large map
- [x] 5.2 Verify camera follows player smoothly
- [x] 5.3 Confirm player cannot walk beyond world edges
- [x] 5.4 Verify grid background is visible and tiles correctly
