## ADDED Requirements

### Requirement: Animation List Display
The system SHALL display a selectable list of all available animation tiles in the UI.

#### Scenario: Populate list
- **WHEN** the Animation tab is active
- **THEN** the UI SHALL retrieve the list of defined animations from the registry
- **AND** display an entry for each available animation

### Requirement: Animation Preview
The system SHALL render a visual preview for each animation tile in the list.

#### Scenario: Render preview
- **WHEN** the animation list is displayed
- **THEN** each item SHALL show a preview of the animation (either static frame or cycling animation)
- **AND** the preview SHALL match the visual appearance of the tile in-game

### Requirement: Animation Selection
The system SHALL allow users to select an animation tile to be the active painting tool.

#### Scenario: Select animation
- **WHEN** the user clicks on an animation tile in the list
- **THEN** that animation ID SHALL become the active `selectedTileId` (or `selectedAnimationId`)
- **AND** the painting mode SHALL update to place this animation
