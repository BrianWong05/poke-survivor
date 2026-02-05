## Why

Transition to `HashRouter` to support deployment on static hosting (like GitHub Pages) without server-side routing configuration. Set the base URL to `/poke-survivor/` to match the project name and intended deployment path.

## What Changes

- Install `react-router-dom` as a dependency.
- Update `vite.config.ts` to set `base: '/poke-survivor/'`.
- Update `src/App.tsx` to use `HashRouter` for navigation between the main game, character select, and level editor.
- Refactor `App.tsx` to use `Routes` and `Route` instead of manual state-based conditional rendering for major screens.

## Capabilities

### New Capabilities
- `routing`: Infrastructure for client-side routing using `react-router-dom` and `HashRouter`.

### Modified Capabilities
- `game-core`: Integration with the new routing system for game start/exit flows.
