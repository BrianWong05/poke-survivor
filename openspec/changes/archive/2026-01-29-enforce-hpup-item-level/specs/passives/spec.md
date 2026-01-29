# HpUp Strict Scaling

## MODIFIED Requirements

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
