## Context

The current `MainScene.ts` creates a single-screen game where the player and all entities exist within the visible viewport (~800x600). To enable exploration, we need:
1. A larger physics world (3200x3200 pixels)
2. A procedural background texture that tiles across the entire map
3. A camera that follows the player with smooth easing

## Goals / Non-Goals

**Goals:**
- Expand the playable area to 3200x3200 pixels
- Create a procedural grid-pattern background using Phaser's `make.graphics` and `generateTexture`
- Configure the physics world bounds to contain the player
- Set up the camera to follow the player smoothly and respect world edges

**Non-Goals:**
- Changing enemy spawn logic (can be addressed in a follow-up change)
- Adding different terrain types or biomes
- Implementing minimap or map indicators

## Decisions

### 1. Map Size: 3200x3200
**Rationale**: Roughly 4x4 screens provides ample exploration space without overwhelming memory. This is easily adjustable later.

### 2. Procedural Grid Background
**Approach**: Use `this.make.graphics()` to draw a 64x64 tile with a forest-green fill and darker border, then `generateTexture('grid_bg', 64, 64)` to create a reusable texture.
**Alternative Considered**: Using a pre-made image asset. Rejected because procedural generation is simpler and doesn't require external assets.

### 3. TileSprite for Background
**Approach**: Use `this.add.tileSprite()` positioned at the center of the world, spanning the full map dimensions.
**Rationale**: TileSprite is optimized for repeating textures and handles large areas efficiently.

### 4. Camera Configuration
**Approach**: 
- `this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)` - confines camera to world
- `this.cameras.main.startFollow(this.player, true, 0.1, 0.1)` - smooth follow with lerp values
**Alternative Considered**: Manual camera positioning in `update()`. Rejected because Phaser's built-in follow is simpler and well-optimized.

### 5. Player Spawn Position
**Change**: Player spawns at world center (1600, 1600) instead of screen center.
**Rationale**: Allows player to explore in all directions from the start.

## Risks / Trade-offs

- **[Risk]** Enemy spawning may need adjustment to spawn relative to the camera view, not absolute world edges.  
  → **Mitigation**: Defer to follow-up change. Current spawning logic will continue to work, just may spawn enemies off-screen.

- **[Risk]** UI elements (HUD, Inventory) must remain fixed to the camera, not the world.  
  → **Mitigation**: Existing code already uses `setScrollFactor(0)` for UI elements.
