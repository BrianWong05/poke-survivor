## MODIFIED Requirements

### Requirement: Player Stats Recalculation
The system SHALL recalculate player stats based on base stats and active items.

#### Scenario: Recalculate amount stat
- **WHEN** the player's items are updated (added or leveled up)
- **THEN** the `amount` stat should be recalculated
- **AND** it should sum the additional projectiles provided by items like "Loaded Dice"
