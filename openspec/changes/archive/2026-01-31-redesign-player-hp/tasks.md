# Tasks: Redesign Player HP

- [x] 1. Create `src/game/ui` directory. <!-- validation: `ls -d src/game/ui` -->
- [x] 2. Implement `FloatingHpBar.ts` in `src/game/ui/`. <!-- validation: `ls src/game/ui/FloatingHpBar.ts` -->
    - [x] Define class `FloatingHpBar`.
    - [x] Implement `draw(current, max)`.
    - [x] Implement `update()` for position syncing.
- [x] 3. Integrate into `Player.ts`. <!-- validation: `grep "FloatingHpBar" src/game/entities/Player.ts` -->
    - [x] Instantiate in `constructor`.
    - [x] Update in `preUpdate`.
    - [x] Trigger redraw in `takeDamage`, `heal`, `setHealth`.
- [x] 4. Remove HP elements from React HUD `src/components/HUD/index.tsx`. <!-- validation: manual check or grep negative -->
    - [x] Remove `hp-container` and children.
    - [x] Remove `hp` prop from interface (optional but recommended).
- [x] 5. Verify visually. <!-- validation: manual -->
    - [x] Run game, take damage, check bar updates.
    - [x] Check HUD is clean.
