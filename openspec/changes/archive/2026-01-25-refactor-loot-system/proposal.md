# Refactor Loot System

## Summary
Introduce a dedicated **LootManager** system with enemy-tier-based drop logic, using Pokémon-themed item names and values. Replace the current flat-weighted candy roll with tier-specific drop tables.

## Motivation
The current `ExperienceManager.rollCandyTier()` uses static weights regardless of enemy type. This change:
1. Creates a cleaner separation of concerns (`LootManager` for drops, `ExperienceManager` for XP/leveling)
2. Adds enemy tier classification to `EnemyConfig`
3. Implements the Pokémon Rare Candy mechanic (instant level-up)
4. Makes drop rates feel more rewarding as difficulty increases

## Scope

### New System: `LootManager.ts`
- Central drop handling via `drop(x, y, enemyTier)` method
- Tier-to-candy mapping with weighted probabilities (Tiers 1-5 + Boss)

### Modified: `EnemyConfig.ts`
- Add `tier: EnemyTier` property to each enemy type
- Define `EnemyTier` enum: `TIER_1`, `TIER_2`, `TIER_3`, `BOSS`

### Modified: `ExperienceManager.ts`  
- Update XP values: `S=1`, `M=10`, `L=100`, `RARE=1000`
- Remove `XL` tier (consolidate into `L` for simplicity)
- Add `addInstantLevel()` method for Rare Candy effect

### Modified: `MainScene.ts`
- Replace `spawnExpCandy(x, y)` calls with `lootManager.drop(x, y, enemyTier)`
- Integrate `LootManager` instance

## Out of Scope
- New enemy types (Caterpie, Magneton, Arbok, Snorlax, Onix) — use existing enemies with tier assignments
- Boss spawning mechanics (future change)

## Specs Affected
- `loot-system` (NEW) — Drop logic and item definitions
- `enemy-system` (MODIFY) — Add tier classification
- `experience-system` (MODIFY) — Update candy values and add instant level method

## Dependencies
- None (self-contained refactor)

## Risks
- Breaking existing XP pickup flow if integration is incorrect
- Mitigation: Verify via browser testing that XP still awards on candy pickup
