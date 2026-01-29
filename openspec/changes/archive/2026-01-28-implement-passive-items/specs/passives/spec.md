# Spec: Passive Items

## ADDED Requirements

### Requirement: HpUp Item
The `HpUp` item MUST increase the player's Maximum Health and current Health when acquired or upgraded.

#### Scenario: Acquiring HpUp
Given the player has 100/100 HP
When the player acquires `HpUp` Level 1 (+20 MaxHP)
Then the player's MaxHP should become 120
And the player's Health should become 120 (Healed by increase amount)

#### Scenario: Upgrading HpUp
Given the player has `HpUp` Level 1 and 120 MaxHP
When the player upgrades `HpUp` to Level 2 (+20 MaxHP)
Then the player's MaxHP should become 140

### Requirement: Leftovers Item
The `Leftovers` item MUST increase the player's Health Regeneration rate.

#### Scenario: Acquiring Leftovers
Given the player has 0 Regen
When the player acquires `Leftovers` Level 1 (+1 Regen)
Then the player's Regen stat should be 1
And the player should regenerate 1 HP per second

### Requirement: Iron Item
The `Iron` item MUST increase the player's Defense stat.

#### Scenario: Defense Scaling
Given the player has 0 Defense
When the player acquires `Iron` Level 1 (+1 Defense)
Then the player's Defense should be 1
And incoming damage should be reduced by 1

#### Scenario: Defense Progression
Given the player has `Iron` Level 1
When the player upgrades `Iron` to Level 3 (+1 Defense every 2 levels)
Then the player's Defense should increase appropriately (e.g., total 2 or 3 depending on exact formula)
