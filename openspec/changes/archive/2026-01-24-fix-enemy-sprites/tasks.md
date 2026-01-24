# Tasks: Fix Enemy Sprite Facing Direction

## Implementation Tasks

- [x] **Update enemy animation in game loop**
  - Modify `MainScene.update()` to call `getDirectionFromVelocity()` for each enemy
  - Play the appropriate directional walk animation based on velocity
  - Use `enemy.play(animKey, true)` to avoid animation restart flicker

## Verification Tasks

- [x] **Manual browser testing**
  - Run dev server and observe enemies facing toward the player from all spawn edges
  - Move player around and confirm enemies continuously update facing direction
