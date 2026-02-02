# passives Specification

## Purpose
This specification defines the system for passive items that provide permanent stat bonuses or utility effects to the player.

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

### Requirement: Muscle Band Item
The `Muscle Band` item MUST increase the player's damage output (`might`).

#### Scenario: Acquisition and Leveling
- **WHEN** the player acquires `Muscle Band` Level 1
- **THEN** the player's `might` stat increases by 10% (+0.10 multiplier)
- **WHEN** the player upgrades `Muscle Band` to Level 5 (Max)
- **THEN** the total `might` increase SHALL be 50% (+0.50 multiplier)

### Requirement: Muscle Band Sprite
The `Muscle Band` item MUST display correctly using its designated sprite.
- **Sprite Key**: `muscle_band`
- **Source**: `public/assets/items/muscle_band.png`

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

### Requirement: Magnet Passive Item
The Magnet item MUST be registered as a passive item in the game's item system.
- **ID**: `magnet`
- **Type**: `passive`
- **Effect**: Increases pickup range.

#### Scenario: Item Registration
- **WHEN** the item data is initialized
- **THEN** the `magnet` item is included in the available passive items list.

### Requirement: Lucky Egg passive item
The system SHALL support the Lucky Egg as a passive item.

#### Scenario: Lucky Egg Sprite and Asset
- **WHEN** the Lucky Egg is initialized
- **THEN** it MUST use the `lucky_egg` sprite key
- **AND** the sprite SHALL be loaded from `public/assets/items/lucky_egg.png`

### Requirement: Lucky Egg Metadata
The Lucky Egg SHALL have following properties:
- **Max Level**: 5
- **Description**: Gain 10% more experience.

### Requirement: Muscle Band Item Registration
The Muscle Band item MUST be registered as a passive item in the game's item system.

#### Scenario: Item Registration
- **WHEN** the item data is initialized
- **THEN** the `muscle_band` item is included in the available passive items list.
