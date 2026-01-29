# passives Specification

## Purpose
TBD - created by archiving change implement-passive-items. Update Purpose after archive.
## Requirements
### Requirement: HpUp Item
The `HpUp` item MUST calculate its bonus strictly based on the item's level.
- **Formula**: `Bonus = ItemLevel * 5`
- **Constraint**: Must NOT use Player Level.

#### Scenario: Level 1 Acquisition
- Given the player acquires HpUp (Level 1)
- Then `maxHP` increases by 5
- And the player is healed by 5

#### Scenario: Level Up to 2
- Given the player upgrades HpUp to Level 2
- Then `maxHP` increases by another 5 (Total +10)
- And the player is healed by 5

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

