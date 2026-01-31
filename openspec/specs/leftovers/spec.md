# leftovers Specification

## Purpose
TBD - created by archiving change implement-leftovers-passive. Update Purpose after archive.
## Requirements
### Requirement: Passive Item: Leftovers
The game MUST include a "Leftovers" passive item.

#### Scenario: Item Definition
GIVEN the game is running
WHEN the player views the "Leftovers" item details
THEN the name MUST be "Leftovers (剩飯)"
AND the description MUST be "Restores 0.5 HP per second per rank."
AND the texture MUST be `'item_leftovers'`
AND the tint MUST be green (`0x00FF00`).

### Requirement: Stats Scaling
Stats MUST scale linearly with item level.

#### Scenario: Stats Scaling
GIVEN the player has the "Leftovers" item
WHEN getting stats for a specific level
THEN the value MUST be `level * 0.5`
AND the increase per level MUST be `0.5`.

### Requirement: Regen Application
Acquiring or upgrading the item MUST increase player regeneration.

#### Scenario: Regen Application
GIVEN the player acquires "Leftovers"
WHEN the item is added or leveled up
THEN the player's `regen` stat MUST increase by `0.5`.

### Requirement: Regen Effect
Player health MUST regenerate over time.

#### Scenario: Regen Effect
GIVEN the player has positive regeneration
WHEN the player is injured (HP < Max HP)
THEN the player MUST restore HP over time based on the `regen` value (handled generic player logic, verified here for integration).

