## 1. Asset Setup

- [x] 1.1 Download Amulet Coin sprite from `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png`
- [x] 1.2 Load `amulet_coin` image in `src/game/scenes/Preloader.ts`

## 2. Item Definition

- [x] 2.1 Add `AMULET_COIN` configuration to `src/game/data/ItemData.ts`

## 3. Player Logic

- [x] 3.1 Initialize `greed` stat in `src/game/entities/Player.ts`
- [x] 3.2 Implement `greed` recalculation in `Player.recalculateStats()`
- [x] 3.3 Apply `greed` multiplier in `Player.gainGold()` or equivalent pickup logic

## 4. Verification

- [ ] 4.1 Verify Amulet Coin appears in level-up selection
- [ ] 4.2 Verify gold gain increases by 20% at level 1
- [ ] 4.3 Verify gold gain increases by 100% at level 5
