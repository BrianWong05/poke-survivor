## Context

Currently, `MainScene`'s `handleGameOver` sets a `gameOver` flag which stops the custom `update` loop logic. However, it does not explicitly stop Phaser's internal systems (Physics, Animations, Tweens, Time), causing visual elements to continue moving or playing animations behind the Game Over UI.

## Goals / Non-Goals

**Goals:**
- Visually freeze the game world upon Game Over.
- Ensure the Game Over UI (buttons, text) remains interactive.

**Non-Goals:**
- Changing the specific Game Over UI capability.

## Decisions

**Manual Subsystem Pausing:**
We will manually pause `physics`, `anims`, `tweens`, and `time` instead of calling `this.scene.pause()`.
- **Rationale:** The Game Over UI buttons are Phaser GameObjects within the `MainScene`. calling `this.scene.pause()` would freeze the scene's InputPlugin, rendering the "Select New Character" button unresponsive. By manually pausing subsystems, we stop the gameplay visuals while keeping the Scene active for UI interaction.

## Risks / Trade-offs
- **Risk:** New systems added in the future might need to be manually paused if they don't rely on the global systems.
- **Mitigation:** Document that Game Over should be a "soft" pause similar to the pause menu.

## Migration Plan
None. Simple logic update.
