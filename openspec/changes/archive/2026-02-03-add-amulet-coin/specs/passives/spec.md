## ADDED Requirements

### Requirement: Amulet Coin Item
The `Amulet Coin` item MUST increase the player's gold gain (`greed`).
- **Effect**: +20% (`0.20` multiplier) per level.
- **Max Level**: 5.
- **Sprite**: `amulet_coin`.
- **Source**: `public/assets/items/amulet_coin.png`

#### Scenario: Acquisition and Leveling
- **WHEN** the player acquires Amulet Coin Level 1
- **THEN** the player's `greed` multiplier increases by 20% (+0.20)
- **WHEN** the player upgrades Amulet Coin to Level 5 (Max)
- **THEN** the total `greed` increase SHALL be 100% (+1.00 multiplier)
