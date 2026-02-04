## Why

The current map saving process in the Level Editor uses a native `window.prompt`, which is disconnected from the app's aesthetic and does not allow users to see existing maps. This makes it difficult to manage maps or avoid naming conflicts without manually checking the load list first.

## What Changes

- Replace the native `window.prompt` in `handleSaveMap` with a custom React modal.
- The modal will display a list of all existing maps (fetched from `/api/maps`).
- Users can input a new name in an input field OR click an existing map name to populate the input.
- Added overwrite protection: if a user tries to save with an existing name, a confirmation prompt (inline or separate) will appear.

## Capabilities

### New Capabilities
- `map-save-ui`: A custom UI for saving maps that provides context of existing maps and overwrite safety.

### Modified Capabilities
- `level-editor`: Update the save flow requirement to use a custom UI instead of native prompts.

## Impact

- `src/components/LevelEditor/index.tsx`: Main logic change for handling the save modal.
- `src/components/LevelEditor/styles.css`: Adding styles for the new save modal components.
- Potential refactoring of `LoadModal` into a reusable `MapModal` if the logic overlaps significantly.
