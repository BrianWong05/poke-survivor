## 1. Environment and Configuration

- [x] 1.1 Install `react-router-dom` dependency.
- [x] 1.2 Update `vite.config.ts` to set `base: '/poke-survivor/'`.

## 2. Routing Implementation

- [x] 2.1 Refactor `src/App.tsx` to include `HashRouter`, `Routes`, and `Route`.
- [x] 2.2 Define routes:
  - `/` -> `CharacterSelect`
  - `/game/:characterId` -> `GameCanvas` + `HUD`
  - `/editor` -> `LevelEditor`
- [x] 2.3 Update navigation logic in `CharacterSelect`, `HUD`, and `LevelEditor` to use `useNavigate` instead of callbacks where appropriate.

## 3. Localization and Assets

- [x] 3.1 Ensure `i18next` and asset loading handle the new base URL correctly.

## 4. Verification

- [x] 4.1 Verify navigation to all three main routes.
- [x] 4.2 Run `npm run build` and verify `index.html` uses the correct base path for assets.
