## Context
The Level Editor has a "Play" button intended to test the map currently being edited. However, the current implementation in `App.tsx` navigates to the game page without passing the map data, resulting in the game loading the default map/character state.

## Goals / Non-Goals

**Goals:**
- Enable the "Play" button in Level Editor to launch the game with the current map data.
- Ensure the Game page correctly initializes `GameCanvas` with the passed map data.
- Maintain existing game functionality when accessed normally (not from editor).

**Non-Goals:**
- Persisting the test map to the server (the map is passed in-memory for testing).
- Changing the Level Editor UI (other than connecting the button logic).

## Decisions

### Navigation State
We will use React Router's `navigate` function with the `state` object to pass `CustomMapData` from `LevelEditorPage` to `GamePage`.
- **Pros**: Simple, uses existing routing infrastructure, no need for global store or persistent storage for temporary test data.
- **Cons**: Data is lost on page refresh (acceptable for "test play" scenario, user can just hit play again from editor).

### GamePage Initialization
`GamePage` will check `location.state.customMapData`. If present, it will be passed to `GameCanvas`.
- This requires `GamePage` to use `useLocation`.

## Risks / Trade-offs
- **Data Size**: `CustomMapData` includes the grid and palette. If maps get extremely large, passing via state might have performance implications, but for tilemaps it should be negligible.
- **Refresh**: As noted, refreshing the game page will lose the map data. This is a standard trade-off for in-memory state navigation.
