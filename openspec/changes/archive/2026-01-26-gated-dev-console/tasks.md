# Tasks: Gated Dev Console

## Implementation

- [x] **Config Guards**
  - [x] Add `import.meta.env.DEV` guard to `DevConsole.tsx` render function.
  - [x] Add `import.meta.env.DEV` guard to `useEffect` keyboard listeners in `DevConsole.tsx`.
- [x] **Parent Integration**
  - [x] Wrap `<DevConsole />` in `App.tsx` with `{import.meta.env.DEV && ...}`.

## Verification

- [x] **Development Test**
  - [x] Run `npm run dev`.
  - [x] Verify Backtick (`) still opens the console.
- [x] **Production Build Test**
  - [x] Run `npm run build`.
  - [x] Run `npm run preview`.
  - [x] Verify Backtick (`) does **not** open the console.
  - [x] Inspect build artifacts (optional) to confirm `DevConsole` strings are missing.
