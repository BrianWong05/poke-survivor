## Context

The game uses a two-layer tilemap system (Ground and Objects). Currently, all physics interactions are restricted to world bounds, meaning players can walk over any tile. For a better gameplay experience, tiles on the "Objects" layer should act as physical barriers.

## Goals / Non-Goals

**Goals:**
- Implement static physics collision for the `Objects` layer in custom maps.
- Ensure the player cannot enter tiles that contain an object.
- Keep the implementation simple by using standard Phaser tilemap physics.

**Non-Goals:**
- Per-tile custom collision shapes (rectangles are enough for now).
- Collisions on the `Ground` layer.
- Dynamic objects (moving obstacles) – this is for static map objects only.

## Decisions

### 1. Enable Tilemap Physics in MainScene
We will use Phaser's built-in tilemap collision system.
- **Rationale**: It's efficient and integrates perfectly with the existing Arcade Physics system used for the player and enemies.
- **Alternatives**: Using individual physics sprites for every object. This would be much more expensive for performance and complex to manage with the existing level editor output.

### 2. Set Collision by Exclusion
We will call `setCollisionByExclusion([-1])` on the `Objects` tilemap layer.
- **Rationale**: This automatically makes every tile that isn't empty (-1) a solid block. Since the level editor separates "Ground" and "Objects", we can assume anything on the "Objects" layer is intended to be solid.

### 3. Add Player-Map Collider
We will add a collider between the player and the `Objects` layer.
- **Rationale**: Required for the physics engine to actually prevent movement through the tiles.

## Risks / Trade-offs

- [Risk] Level Editor "Objects" layer might contain things like flowers or grass that should NOT be solid. → [Mitigation] In the future, we could add a "non-solid" metadata property, but for now, the user should only place solid objects on the Objects layer.
- [Risk] Large maps might have performance issues with many collidable tiles. → [Mitigation] Phaser optimizes tilemap collisions by only checking tiles near the physics body.
