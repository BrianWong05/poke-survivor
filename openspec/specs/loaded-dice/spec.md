# loaded-dice Specification

## Purpose
Specification for the Loaded Dice (老千骰子) passive item.

## Requirements

### Requirement: Loaded Dice Item
The system SHALL provide a "Loaded Dice" passive item that increases the number of projectiles fired by weapons.

#### Scenario: Item definition
- **WHEN** the item directory is loaded
- **THEN** "Loaded Dice" should be defined with ID `loaded_dice`
- **AND** it should have a max level of 2
- **AND** it should provide +1 projectile amount per level
