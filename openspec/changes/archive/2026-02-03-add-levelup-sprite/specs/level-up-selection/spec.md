## MODIFIED Requirements

### Requirement: Selection cards displayed
The system SHALL provide a Phaser Scene for displaying and selecting level-up options.

#### Scenario: Selection cards displayed
- **WHEN** `LevelUpScene.create()` is called
- **THEN** 3-4 selection cards are displayed
- **AND** each card shows the item name
- **AND** each card shows "New!" or "Lv.X → Lv.Y"
- **AND** each card displays the item's sprite/icon
- **AND** each card is interactive (pointer events)

## ADDED Requirements

### Requirement: Sprite Fallback
The system SHALL provide a visual fallback if a specific item sprite is missing from the texture cache.

#### Scenario: Missing sprite texture
- **WHEN** a selection card is being rendered
- **AND** the `spriteKey` is not present in the Phaser texture cache
- **THEN** the card SHALL display a default placeholder icon (e.g., a circle with the item's initial)
- **AND** no error SHALL be thrown by the scene
