# Tasks: Code Quality Audit Refactoring

## Phase 1: Import Rule Fixes
- [ ] Fix relative imports in `src/main.tsx`
- [ ] Fix relative imports in `src/game/entities/Player.ts`
- [ ] Fix relative imports in `src/game/entities/items/` (registry, passive items)
- [ ] Fix relative imports in `src/game/entities/projectiles/FocusBlastProjectile.ts`
- [ ] Fix relative imports in `src/features/DevConsole/` (all 10+ files)

## Phase 2: Critical File Decomposition
- [ ] Refactor `MainScene.ts` - Extract debug proxies and event handling
- [ ] Refactor `Enemy.ts` - Extract status effects and rendering

## Phase 3: Moderate Refactoring
- [ ] Extract `PlayerInventory` from `Player.ts`
- [ ] Create reusable `LevelUpCard` component from `LevelUpScene.ts`

## Verification
- [ ] Run `npm run build` to verify no import errors
- [ ] Run `npm run dev` and test gameplay
- [ ] Verify DevConsole functionality
- [ ] Check TypeScript compilation with strict mode
