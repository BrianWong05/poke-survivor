## 1. Asset Generation

- [x] 1.1 Generate 'Assault Vest' sprite using `generate_image` (32x32, tactical vest style)
- [x] 1.2 Save generated sprite to `public/assets/items/assault_vest.png`
- [x] 1.3 Update `src/game/scenes/Preloader.ts` to load `assault_vest.png` instead of `iron.png`

## 2. Code Refactoring

- [x] 2.1 Rename `src/game/entities/items/passive/Iron.ts` to `AssaultVest.ts`
- [x] 2.2 Update class name in `AssaultVest.ts` to `AssaultVest`
- [x] 2.3 Update ID, name, description, and texture key in `AssaultVest.ts`
- [x] 2.4 Update `src/game/entities/Player.ts` to use `assault_vest` ID in `recalculateStats`
- [x] 2.5 Update `src/game/systems/DevDebugSystem.ts` (if applicable) to reference `assault_vest`

## 3. Verification

- [x] 3.1 Verify item appears in Level Up options with new sprite and text
- [x] 3.2 Verify defense stat increases correctly when acquiring Assault Vest
- [x] 3.3 Verify no "Iron" references remain in the game UI or code
