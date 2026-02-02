## 1. Core Architecture

- [x] 1.1 Create `src/game/entities/weapons/Weapon.ts` abstract base class implementing `WeaponConfig`.
- [x] 1.2 Implement `damage` property and `getCalculatedDamage` method in `Weapon`.
- [x] 1.3 Add `get stats()` accessor to `Player.ts` to expose `CharacterConfig.stats`.

## 2. Refactoring

- [x] 2.1 Refactor `AuraSphere.ts` to extend `Weapon` base class.
- [x] 2.2 Update `AuraSphere.ts` fire method to use `getCalculatedDamage`.
- [x] 2.3 Verify `AuraSphere` still works and deals correct damage (check logs).
- [x] 2.4 Implement ±15% random variance in `Weapon.getCalculatedDamage`.

## 3. Visual Feedback

- [x] 3.1 Create `src/game/ui/FloatingDamage.ts` component.
- [x] 3.2 Update `Enemy.ts` to spawn `FloatingDamage` on `takeDamage`.

## 4. Weapon Standardization

- [x] 4.1 Refactor `ThunderShock.ts` to extend `Weapon`.
- [x] 4.2 Refactor `WaterPulse.ts` to extend `Weapon`.
- [x] 4.3 Refactor `BodySlam.ts` to extend `Weapon`.
- [x] 4.4 Refactor `ThunderWave.ts` to extend `Weapon`.
- [x] 4.5 Refactor `SludgeBomb.ts` to extend `Weapon`.
- [x] 4.6 Refactor `Thunderbolt.ts` to extend `Weapon`.
