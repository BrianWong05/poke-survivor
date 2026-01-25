# Tasks

- [x] Refactor `src/game/entities/enemies/Enemy.ts`:
    - [x] Update constructor to set `this.setScale(1.5)`.
    - [x] Update `flashHit()` to use `setTintFill(0xffffff)`.
    - [x] Update `takeDamage()` to include the squash/stretch tween logic.
    - [x] Update `Preloader.ts` to increase animation frameRate to 12.
- [x] Verify:
    - [x] Enemies appear 50% larger than before.
    - [x] Hit reaction flashes pure white (not just tinted).
    - [x] Enemies "pop" briefly when hit.
    - [x] Death animation still looks correct with the larger scale.
