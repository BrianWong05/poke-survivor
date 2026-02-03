## 1. Data Model & Logic

- [x] 1.1 Add `spriteKey?: string` to `LevelUpOption` interface in `LevelUpManager.ts`
- [x] 1.2 Update `LevelUpManager.getOptions()` to populate `spriteKey` for passive items using `item.spriteKey`
- [x] 1.3 Update `LevelUpManager.getOptions()` to populate `spriteKey` for weapons using `weaponConfig.id` (normalized)

## 2. UI Rendering

- [x] 2.1 Update `LevelUpScene.createCard()` to load and display the sprite if `option.spriteKey` is provided
- [x] 2.2 Implement texture existence check and fallback to letter placeholder
- [x] 2.3 Adjust sprite scaling and positioning within the card icon area

## 3. Verification

- [x] 3.1 Verify item selection shows correct sprites for passive items (e.g., Muscle Band, Lucky Egg)
- [x] 3.2 Verify weapon selection shows correct sprites (e.g., Will-O-Wisp)
- [x] 3.3 Verify fallback icon appears for weapons or items without valid sprite keys
