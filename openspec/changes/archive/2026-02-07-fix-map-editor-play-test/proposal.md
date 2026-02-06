## Why
The "Play" button in the Level Editor currently navigates to the game but does not load the map being edited. This prevents users from testing their custom maps immediately.

## What Changes
We will modify the navigation logic in `App.tsx` to pass the map data from the Level Editor to the Game page using React Router's state. The Game page will then initialize `GameCanvas` with this custom map data.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None.

## Impact
- `src/App.tsx`: Update `LevelEditorPage` and `GamePage` navigation logic.
