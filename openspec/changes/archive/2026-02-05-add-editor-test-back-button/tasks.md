## 1. App State & Logic

- [x] 1.1 Add `handleBackToEditor` callback in `App.tsx`
- [x] 1.2 Update `handlePlayCustomMap` to ensure clean state if needed
- [x] 1.3 Update `App.tsx` render logic to pass callback to `HUD`

## 2. HUD Component Update

- [x] 2.1 Update `HUDProps` to include `onBackToEditor` optional callback
- [x] 2.2 Implement "Back to Editor" button in `HUD` component
- [x] 2.3 Style the new button to match the game's aesthetic

## 3. Verification

- [x] 3.1 Verify button visibility in regular game mode
- [x] 3.2 Verify button visibility and functionality in map test mode
- [x] 3.3 Ensure Level Editor state is preserved after returning from test
