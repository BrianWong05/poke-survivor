## Why

When the game ends ("Game Over"), visual elements such as enemy animations, particle effects, and tweens continue to update and move, creating a jarring and unpolished experience. The user expects the game state to essentially freeze visually while the Game Over UI is displayed.

## What Changes

- Update the Game Over handling logic to explicitly pause the Phaser scene or its subsystems.
- Ensure that:
    - Sprite animations stop (via `anims.pauseAll`).
    - Physics bodies stop moving (via `physics.pause`).
    - Tweens and timers stop (via `tweens.pauseAll` and `time.paused`).
- This brings the Game Over state in line with the Pause menu behavior.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `game-core`: Update Game Over state to enforce visual freeze (animations, physics, tweens).

## Impact

- **src/game/scenes/MainScene.ts**: Modification to `handleGameOver`.
- **src/game/systems/UIManager.ts**: Potential reuse of pause logic or ensuring Game Over UI remains interactive while logic is paused.
