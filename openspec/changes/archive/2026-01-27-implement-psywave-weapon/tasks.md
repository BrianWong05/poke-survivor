# Tasks: Implement Psywave Weapon

- [ ] Create `src/game/entities/weapons/specific/Psywave.ts`
  - [ ] Implement `PsywaveShot` class for projectile logic (orbit, immunity).
  - [ ] Implement `Psywave` class for weapon config and fire orchestration.
  - [ ] Implement `getStats` with level progression 1-8.
  - [ ] Implement `fire` with spacing math and cleanup logic.
- [ ] Register weapon in `src/game/entities/weapons/index.ts` (if registry exists, or just ensure it's exported).
- [ ] Verify functionality (Manual Test):
  - [ ] Check orbit visual.
  - [ ] Check distribution angles.
  - [ ] Check cleanup on re-fire.
  - [ ] Check Level 8 infinite duration behavior.
  - [ ] Check collision/immunity timer.
