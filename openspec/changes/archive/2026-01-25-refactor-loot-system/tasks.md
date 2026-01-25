# Tasks: Refactor Loot System

## 1. Item & Tier Definitions
- [ ] 1.1 Create `systems/LootConfig.ts` with `LootItemType` enum and XP value constants
  - `EXP_CANDY_S`: 1 XP (Blue/Small)
  - `EXP_CANDY_M`: 10 XP (Green/Medium)
  - `EXP_CANDY_L`: 100 XP (Red/Large)
  - `RARE_CANDY`: 1000 XP or instant level (Glowing/Rainbow)
- [### Modified: `EnemyConfig.ts`
- Add `tier: EnemyTier` property to each enemy type
- Define `EnemyTier` enum: `TIER_1` to `TIER_5`, `BOSS`
- [ ] 1.3 Assign tiers to existing enemies:
  - Rattata → Tier 1
  - Geodude, Zubat → Tier 2
  - (Future enemies: Tier 3, Boss)

## 2. LootManager System
- [ ] 2.1 Create `systems/LootManager.ts` class
  - Constructor receives `scene: MainScene` reference
  - `drop(x: number, y: number, enemyTier: EnemyTier): void`
- [ ] 2.2 Implement tier-based drop tables:
  - Tier 1: 100% EXP_CANDY_S
  - Tier 2: 80% EXP_CANDY_S, 20% EXP_CANDY_M
  - Tier 3: 100% EXP_CANDY_M
  - Tier 4: 80% EXP_CANDY_M, 20% EXP_CANDY_L
  - Tier 5: 100% EXP_CANDY_L
  - Boss: 95% EXP_CANDY_L, 5% RARE_CANDY
- [ ] 2.3 Move candy spawning logic from `MainScene.spawnExpCandy` to `LootManager`

## 3. ExperienceManager Updates
- [ ] 3.1 Update `EXP_CANDY_VALUES` in `ExperienceManager.ts`:
  - S: 1, M: 10, L: 100, RARE: 1000
- [ ] 3.2 Remove `XL` tier (consolidate)
- [ ] 3.3 Add `addInstantLevel()` method for Rare Candy effect
  - Sets `currentXP = xpToNextLevel` to trigger immediate level-up

## 4. MainScene Integration
- [ ] 4.1 Instantiate `LootManager` in `MainScene.create()`
- [ ] 4.2 Update `enemy:death` handler to call `lootManager.drop(x, y, enemyType.tier)`
- [ ] 4.3 Update candy pickup handler to check for `RARE_CANDY` and call `addInstantLevel()`
- [ ] 4.4 Remove legacy `spawnExpCandy()` and `spawnRareCandy()` methods

## 5. Validation
- [ ] 5.1 Run `openspec validate refactor-loot-system --strict`
- [ ] 5.2 Manual test: Kill Rattata → verify S candy drops (100%)
- [ ] 5.3 Manual test: Kill Geodude/Zubat → verify M candy drops occasionally (~20%)
- [ ] 5.4 Manual test: (Future) Kill Boss → verify L/RARE candy drops
- [ ] 5.5 Manual test: Pick up Rare Candy → verify instant level-up triggers
