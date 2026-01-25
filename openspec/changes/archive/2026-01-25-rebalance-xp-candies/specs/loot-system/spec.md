# Loot System Specs

## MODIFIED Requirements

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
