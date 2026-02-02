## ADDED Requirements

### Requirement: Amulet Coin Item
The Amulet Coin item SHALL increase the player's gold gain (`greed`).
- **Effect**: +20% (`0.20` multiplier) per level.
- **Max Level**: 5.
- **Sprite**: `amulet_coin`.

#### Scenario: Level 1 Acquisition
- **WHEN** the player acquires Amulet Coin Level 1
- **THEN** the player's `greed` stat should be 1.2

#### Scenario: Level 5 Max
- **WHEN** the player has Amulet Coin Level 5
- **THEN** the player's `greed` stat should be 2.0

### Requirement: Gold Multiplication
All gold gained by the player SHALL be multiplied by the `greed` stat and rounded up.

#### Scenario: Picking up 10 gold with 1.2x greed
- **WHEN** the player gains 10 gold
- **AND** the player's `greed` is 1.2
- **THEN** the player should receive 12 gold (ceil(10 * 1.2))
