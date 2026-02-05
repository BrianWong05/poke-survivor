## Solution Overview

The application will transition from manual state-based conditional rendering to a router-driven architecture using `react-router-dom` and `HashRouter`. This choice ensures compatibility with GitHub Pages and other static hosting services that do not support fallback routing.

## User Review Required

> [!IMPORTANT]
> This change introduces `react-router-dom` as a new dependency.
> The base URL will be set to `/poke-survivor/`, which means local development might change from `http://localhost:5173/` to `http://localhost:5173/poke-survivor/`.

## Proposed Changes

### Configuration

- **Vite Config**: Set `base: '/poke-survivor/'` in `vite.config.ts`.

### Dependencies

- **Package.json**: Add `react-router-dom` to dependencies.

### Application Shell (`src/App.tsx`)

- Wrap the main application component with `HashRouter`.
- Define the following routes:
  - `/`: Character Selection (`CharacterSelect`)
  - `/game/:characterId`: Main Gameplay (`GameCanvas` + `HUD`)
  - `/editor`: Level Editor (`LevelEditor`)

## Alternatives Considered

- **BrowserRouter**: Rejected because it requires server-side configuration for SPA fallback, which is not available on many static hosting providers without extra setup (e.g., `404.html` hacks on GitHub Pages).
