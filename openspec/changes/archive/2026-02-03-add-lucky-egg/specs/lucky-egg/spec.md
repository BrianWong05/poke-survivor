## ADDED Requirements

### Requirement: Lucky Egg passive effect
The Lucky Egg SHALL provide a percentage-based experience gain multiplier (`growth`) to the player.

#### Scenario: Level 1 Lucky Egg bonus
- **WHEN** the player has Lucky Egg Level 1
- **THEN** the `growth` multiplier SHALL increase by 0.10 (Total 1.1x)

#### Scenario: Max Level Lucky Egg bonus
- **WHEN** the player has Lucky Egg Level 5
- **THEN** the `growth` multiplier SHALL increase by 0.50 (Total 1.5x)
