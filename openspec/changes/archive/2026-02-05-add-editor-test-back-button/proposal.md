## Why

<!-- Explain the motivation for this change. What problem does this solve? Why now? -->
Currently, when testing a map from the Level Editor, the user is "locked" into the game scene. To return to the editor, they must restart the entire app or go through the character selection screen. Adding a "Back to Editor" button during map testing provides a seamless iteration loop for level design.

## What Changes

<!-- Describe what will change. Be specific about new capabilities, modifications, or removals. -->
1.  **App State Management**: Update `App.tsx` to track when the game is in "Map Testing" mode and provide a way to return to the editor.
2.  **HUD Interface**: Add a "Back to Editor" button to the React HUD that only appears when testing a custom map.
3.  **Exit Logic**: Implement the transition logic to properly unmount the game and re-mount the `LevelEditor` with the previous state preserved.

## Capabilities

### New Capabilities
- `editor-test-exit`: Provide a dedicated UI element and logic to exit map testing and return to the Level Editor.

### Modified Capabilities
- `level-editor`: Requirement added for the "Play/Test" flow to support a return path.
- `game-core`: HUD interface updated to conditionally show the exit button during custom map sessions.

## Impact

1.  `src/App.tsx`: State changes and new handler.
2.  `src/components/HUD/index.tsx`: Component props and UI update.
3.  `src/game/scenes/MainScene.ts`: Registry checks (optional, mainly for documentation).
