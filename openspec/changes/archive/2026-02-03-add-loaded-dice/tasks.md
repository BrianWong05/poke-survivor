## 1. Asset Setup

- [x] 1.1 Download Loaded Dice sprite from PokeAPI to `public/assets/items/loaded_dice.png`
- [x] 1.2 Load `loaded_dice` image in `src/game/scenes/Preloader.ts`

## 2. Configuration & Types

- [x] 2.1 Update `ItemConfig` interface in `src/game/data/ItemData.ts` to include `amount` in `stats`
- [x] 2.2 Register `LOADED_DICE` in `src/game/data/ItemData.ts`

## 3. Player Stats

- [x] 3.1 Add `amount` property to `Player` class in `src/game/entities/Player.ts`
- [x] 3.2 Update `Player.recalculateStats()` to sum the `amount` stat from `loaded_dice` level

## 4. Weapon Logic

- [x] 4.1 Update `Weapon.fire()` in `src/game/entities/weapons/Weapon.ts` to loop based on `player.amount`
- [x] 4.2 Implement spreading logic in `Weapon.fire()` to distribute projectiles
- [x] 4.3 Refactor `AquaRing.ts` to support `amount` stat and fix Level 8 refresh logic
- [x] 4.4 Refactor `PetalDance.ts` to support `amount` stat and fix Level 8 refresh logic 1: +1, Level 2: +2)

## 5. Verification

- [x] 5.1 Use Dev Console to give player "Loaded Dice" and level it up
- [x] 5.2 Confirm projectile count increases per level (Level 1: +1, Level 2: +2)
- [x] 5.3 Confirm projectiles are fired with a 15-degree spread
