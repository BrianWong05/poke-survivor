## 1. Asset Collection

- [x] 1.1 Download the Magnet sprite from PokeAPI source.
- [x] 1.2 Load the Magnet sprite in `src/game/scenes/Preloader.ts`.

## 2. Item Definition

- [x] 2.1 Add the `MAGNET` configuration to `src/game/data/ItemData.ts`.

## 3. Player Radius Logic

- [x] 3.1 Initialize `baseMagnetRadius` and `magnetRadius` in `src/game/entities/Player.ts`.
- [x] 3.2 Implement stat recalculation for `magnetRadius` in `recalculateStats()`.
- [x] 3.3 Update collection distance check to use `magnetRadius`.

## 4. Verification

- [x] 4.1 Verify Magnet appears in level-up options.
- [x] 4.2 Verify pickup range increases visibly as Magnet levels up.
