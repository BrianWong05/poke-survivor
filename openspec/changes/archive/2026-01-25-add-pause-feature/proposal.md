# Pause Feature Proposal

## Goal
Allow the player to pause and resume the game by pressing the ESC key. When paused, the game simulation should stop, and a visual indicator should appear.

## Changes
1.  **Register ESC Key**: Add ESC key binding in `MainScene.setupInput()`.
2.  **Toggle Pause Logic**: Implementation in `MainScene` to handle `physics.pause()` and `physics.resume()`.
3.  **UI Feedback**: Display a simple "PAUSED" text overlay when the game is paused.

## Verification
1.  **Manual Test**: Start game, press ESC. Verify enemies/player stop moving. Press ESC again. Verify game resumes.
