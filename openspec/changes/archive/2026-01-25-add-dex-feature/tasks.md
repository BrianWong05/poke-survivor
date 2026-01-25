
- [ ] **Data Registry**: Create `src/config/GameData.ts` and populate with `PLAYABLE_DEX`, `ENEMY_DEX`, `WEAPON_DEX` using existing entity data. <!-- id: 0 -->
- [ ] **Dex Manager**: Implement `DexManager` in `src/systems/DexManager.ts` with `markSeen`, `markUnlocked`, `isUnlocked` and localStorage persistence. <!-- id: 1 -->
- [ ] **UI Component**: Create `src/components/Menus/DexScreen/index.tsx` and `styles.css` implementing the Tabs, Grid, and Detail View. <!-- id: 2 -->
- [ ] **Integration - Spawner**: Modify `EnemySpawner.ts` to call `DexManager.markSeen` on spawn. <!-- id: 3 -->
- [ ] **Integration - Enemy Death**: Modify `Enemy.ts` (or `onDestroy`) to call `DexManager.markUnlocked` on kill. <!-- id: 4 -->
- [ ] **Integration - Main Menu**: Add a button to open the Dex Screen from the main menu (if applicable) or HUD. <!-- id: 5 -->
