# Tasks

- [x] Create `src/game/entities/hazards/BurningGround.ts` (3 dmg, 500ms tick, 3s lifetime).
- [x] Update `MainScene.ts`:
    - [x] Create `hazardGroup`.
    - [x] Register `hazardGroup` in registry.
    - [x] Implement `handleHazardDamage` with tick check.
    - [x] Setup physics overlap between enemies and hazards.
- [x] Update `src/game/entities/projectiles/Fireball.ts`:
    - [x] Modify `onHit` to spawn `BurningGround`.
    - [x] Add logic to retrieve `hazardGroup` from scene registry.
- [x] Update `src/game/entities/weapons/specific/Ember.ts`:
    - [x] Reduce base damage to 8.
- [x] Verify:
    - [x] Ember hits enemy and spawns burning ellipse.
    - [x] Enemies walking over ellipse take periodic damage (pop-ups visible).
    - [x] Ellipse disappears after 3 seconds.
