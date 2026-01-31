# Tasks: add-level-up-selection

## Phase 1: Foundation

- [x] **[NEW] Create ItemRegistry.ts**
   - File: `src/game/data/ItemRegistry.ts`
   - Use `import.meta.glob` with `{ eager: true }` to scan passive items
   - Export `ITEM_REGISTRY: (typeof Item)[]` containing all valid item classes
   - Verification: Console log shows all registered items on game load

- [x] **[NEW] Create LevelUpManager.ts**
   - File: `src/game/systems/LevelUpManager.ts`
   - Implement `getOptions(player, count)` static method
   - Implement `selectOption(scene, player, option)` static method
   - Verification: Unit-style console test in DevConsole

## Phase 2: Scene Implementation

- [x] **[NEW] Create LevelUpScene.ts**
   - File: `src/game/scenes/LevelUpScene.ts`
   - Register scene in Phaser game config
   - Implement `init(data)` to receive player reference
   - Implement `create()` with:
     - Semi-transparent overlay
     - Card rendering for options
     - Interactive pointer events
     - Reroll and Skip buttons
   - Verification: Manual trigger via DevConsole shows UI

- [x] **[MODIFY] Register LevelUpScene in game config**
   - File: `src/game/config.ts`
   - Add `LevelUpScene` to scenes array
   - Verification: No console errors on game start

## Phase 3: Integration

- [x] **[MODIFY] Update MainScene.ts level-up flow**
   - Replace `UIManager.showLevelUpMenu()` with `scene.launch('LevelUpScene', {...})`
   - Pass player reference and onComplete callback
   - Ensure physics/tweens pause during selection
   - Verification: Level up triggers new selection UI

- [ ] **[MODIFY] Update Player.ts for slot tracking (optional)**
   - Add helper methods/getters for weapon/passive counts if needed
   - Verification: Console check of slot counts

## Phase 4: Polish

- [ ] **UI Refinement**
   - Card visuals: icons, names, level indicators
   - Animations: card entry/exit transitions
   - Touch/mobile compatibility
   - Verification: Visual inspection on desktop and mobile

## Validation Checklist

- [x] ItemRegistry loads all passive items dynamically
- [x] LevelUpManager correctly filters pool by:
  - [x] Existing items below max level (upgrades)
  - [x] New items not in inventory with open slots
  - [x] Slot limits (6 weapons, 6 passives)
- [x] LevelUpScene pauses game physics
- [x] Selecting an upgrade calls `item.levelUp()`
- [x] Selecting a new item adds to inventory
- [x] Skip button resumes without selection
- [x] Reroll button regenerates options
- [x] No enemies can damage player during selection
