## ADDED Requirements

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
