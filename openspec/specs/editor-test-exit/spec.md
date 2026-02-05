# editor-test-exit Specification

## Purpose
Provide a way for users to return to the Level Editor while they are playtesting a custom map.

## Requirements

### Requirement: Show Back Button in Test Mode
The HUD SHALL display a "Back to Editor" button only when the game is running a custom map exported from the Level Editor.

#### Scenario: Button visibility in custom map
- **WHEN** the `MainScene` is launched with `customMapData` present in the registry
- **THEN** the React HUD SHALL display a "Back to Editor" button in the top portion of the screen

#### Scenario: Button hidden in regular game
- **WHEN** the game is launched through the normal character select flow (no `customMapData`)
- **THEN** the "Back to Editor" button SHALL NOT be visible

---

### Requirement: Exit to Editor Logic
The system SHALL return the user to the Level Editor scene when the "Back to Editor" button is clicked, preserving the editor's previous state.

#### Scenario: Clicking Back to Editor
- **WHEN** the user clicks the "Back to Editor" button
- **THEN** the current Phaser game instance SHALL be destroyed
- **AND** the `App` state `isLevelEditorMode` SHALL be set to `true`
- **AND** the `LevelEditor` component SHALL be re-mounted
