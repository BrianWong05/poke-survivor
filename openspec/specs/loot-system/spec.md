# loot-system Specification

## Purpose
TBD - created by archiving change refactor-loot-system. Update Purpose after archive.
## Requirements
### Requirement: Loot Item Definitions
The XP values for candies used for leveling up MUST be tuned for a "Linear + Step" curve.

#### Scenario: Small XP Candy Value
Given a player picks up an `EXP_CANDY_S`,
Then the player receives **1 XP**.

#### Scenario: Medium XP Candy Value
Given a player picks up an `EXP_CANDY_M`,
Then the player receives **3 XP**.

#### Scenario: Large XP Candy Value
Given a player picks up an `EXP_CANDY_L`,
Then the player receives **15 XP**.

#### Scenario: Rare Candy Value
Given a player picks up a `RARE_CANDY`,
Then the player receives **50 XP**.

### Requirement: Tier-Based Drop Logic
Enemies SHALL drop specific loot based on their tier.

#### Scenario: Tier 2 Loot Drop Rates
Given a Tier 2 enemy is defeated,
When loot is rolled,
Then it has a **90% chance** to drop `EXP_CANDY_S` and a **10% chance** to drop `EXP_CANDY_M`.

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

