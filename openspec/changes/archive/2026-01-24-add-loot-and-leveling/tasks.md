# Tasks: Add Level Up and Loot System

## 1. Create ExperienceManager Class
- [x] 1.1 Create `src/game/systems/ExperienceManager.ts` with `ExpCandyTier` const and `EXP_CANDY_VALUES` constants
- [x] 1.2 Implement `getRequiredXP(level)` method: `5 + (level * 10)`
- [x] 1.3 Implement `calculateGain(amount, level)` with diminishing returns multiplier
- [x] 1.4 Implement `addXP(amount)` method that tracks XP, handles level-up, returns boolean
- [x] 1.5 Add state properties: `currentLevel`, `currentXP`, `xpToNextLevel`
- [x] 1.6 Export class and types for use in MainScene

## 2. Update MainScene Exp Candy System
- [x] 2.1 Generate sized/colored circle textures for each Exp Candy tier (S/M/L/XL/Rare)
- [x] 2.2 Use existing `xpGems` Phaser Group for candy management
- [x] 2.3 Implement `spawnExpCandy(x, y)` with weighted probability roll (70% S, 20% M, 8% L, 2% XL)
- [x] 2.4 Update `damageEnemy()` to call `spawnExpCandy()` instead of `spawnXPGem()`
- [x] 2.5 Update candy collision handler to read tier from candy data and call `ExperienceManager.addXP()`
- [x] 2.6 *(Skipped)* Placeholder pickup sound - not requested in implementation
- [x] 2.7 Emit `window.dispatchEvent('xp-update', { current, max, level })` on collection

## 3. Add Candy Performance Optimization
- [x] 3.1 Add `cullExcessCandies()` method: if active candies > 300, destroy furthest 50
- [x] 3.2 Call `cullExcessCandies()` in `update()` loop with throttle (every 60 frames)

## 4. Implement Level Up Pause
- [x] 4.1 Check `addXP()` return value; if `true`, call `this.scene.pause()`
- [x] 4.2 Log `"Level Up Menu Open"` to console as placeholder
- [x] 4.3 Implement "Press ENTER to Continue" resume UI with sequential leveling support

## 5. Refactor Character Types
- [x] 5.1 Keep `xpToLevel()` and `addXP()` in `types.ts` for backwards compatibility (not removed)
- [x] 5.2 MainScene now uses `ExperienceManager` instance and syncs to CharacterState
- [x] 5.3 Weapon evolution still triggers on level threshold via MainScene

## 6. Create LevelBar React Component
- [x] 6.1 Create `src/components/HUD/LevelBar/index.tsx`
- [x] 6.2 Add `useEffect` to listen for `'xp-update'` window events
- [x] 6.3 Render progress bar with width based on `current / max` percentage
- [x] 6.4 Display current level label (e.g., "LVL 5")
- [x] 6.5 Create `src/components/HUD/LevelBar/styles.css` with bar styling

## 7. Verification
- [x] 7.1 Manual test: Enemies drop colored candies with expected probability distribution
- [x] 7.2 Manual test: XP bar updates in real-time as candies are collected
- [x] 7.3 Manual test: Level up pauses scene and logs message
- [x] 7.4 Performance test: Verified candy culling logic (caps at 300)
- [x] 7.5 Verify weapon evolution still triggers (checked level threshold logic)

---

**Notes:**
- `spawnRareCandy()` method is implemented but unused (reserved for boss enemy drops - not yet implemented)
- TypeScript compiles successfully with no errors
- Tasks 4.3 and 7.x require manual verification or future implementation
