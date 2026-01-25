# loot-system Specification

## Purpose
Manages item drops from defeated enemies based on their tier classification. Provides a centralized `LootManager` for spawning experience items with tier-appropriate probabilities.

## ADDED Requirements

### Requirement: Loot Item Definitions
The system SHALL define loot items with fixed XP values based on Pokémon game conventions.

#### Scenario: Loot item type definitions
- **WHEN** `LootConfig` is imported
- **THEN** the following loot items are available:
  - `EXP_CANDY_S`: 1 XP (Visual: Blue/Small)
  - `EXP_CANDY_M`: 10 XP (Visual: Green/Medium)
  - `EXP_CANDY_L`: 100 XP (Visual: Red/Large)
  - `RARE_CANDY`: 1000 XP or instant level-up (Visual: Glowing/Rainbow)

---

### Requirement: Tier-Based Drop Logic
The `LootManager.drop()` method SHALL spawn items based on the enemy's tier classification.

#### Scenario: Tier 1 enemy drop (Rattata, Caterpie)
- **WHEN** `drop(x, y, TIER_1)` is called
- **THEN** `EXP_CANDY_S` is spawned with 100% probability

#### Scenario: Tier 2 enemy drop (Geodude, Zubat)
- **WHEN** `drop(x, y, TIER_2)` is called
- **THEN** `EXP_CANDY_S` is spawned with 80% probability
- **OR** `EXP_CANDY_M` is spawned with 20% probability

#### Scenario: Tier 3 enemy drop (Elites)
- **WHEN** `drop(x, y, TIER_3)` is called
- **THEN** `EXP_CANDY_M` is spawned with 100% probability

#### Scenario: Tier 4 enemy drop (High Elites)
- **WHEN** `drop(x, y, TIER_4)` is called
- **THEN** `EXP_CANDY_M` is spawned with 80% probability
- **OR** `EXP_CANDY_L` is spawned with 20% probability

#### Scenario: Tier 5 enemy drop (Mini-Bosses)
- **WHEN** `drop(x, y, TIER_5)` is called
- **THEN** `EXP_CANDY_L` is spawned with 100% probability

#### Scenario: Boss enemy drop
- **WHEN** `drop(x, y, BOSS)` is called
- **THEN** `EXP_CANDY_L` is spawned with 95% probability
- **OR** `RARE_CANDY` is spawned with 5% probability

---

### Requirement: LootManager API
The `LootManager` class SHALL provide a single entry point for spawning loot.

#### Scenario: Drop method signature
- **WHEN** `lootManager.drop(x, y, enemyTier)` is called
- **THEN** a loot item is spawned at coordinates (x, y)
- **AND** the item type is determined by `enemyTier` using weighted probability

---

### Requirement: Rare Candy Instant Level Mechanic
Picking up a `RARE_CANDY` SHALL trigger an instant level-up instead of adding flat XP.

#### Scenario: Rare Candy pickup
- **WHEN** player collides with a `RARE_CANDY` item
- **THEN** `ExperienceManager.addInstantLevel()` is called
- **AND** player's level increases by 1 immediately
- **AND** the level-up UI is triggered
