## Context

Currently, the Level Editor allows "Playtesting" by exporting map data and re-mounting the game with that data. However, there's no way to return to the editor without restarting the app or going through character selection.

## Goals / Non-Goals

**Goals:**
- Provide a visible "Back to Editor" button during custom map playtests.
- Enable smooth transition back to the Level Editor from the playtest.
- Preserve the map state when returning to the editor (achieved by internal editor state in `App.tsx`).

**Non-Goals:**
- Saving the map automatically upon exit (user should save manually in the editor).
- Changing the character during playtest (stick with default/fixed character for test).

## Decisions

- **HUD Overly**: The "Back to Editor" button will be placed in the `HUD` component's `hud-top` section, likely near the score or level, to avoid interfering with game controls.
- **Conditional Visibility**: The button will only be rendered if `onBackToEditor` prop is provided to the `HUD`.
- **App-Level Logic**: `App.tsx` will manage the transition logic. `isLevelEditorMode` will be toggled back to `true`.

## Risks / Trade-offs

- **State Sync**: If the game persists some data (like player XP) between tests, it might lead to unexpected behavior. However, `App.tsx` re-mounts the `GameCanvas` with a new `gameKey`, ensuring a fresh game state for each test.
