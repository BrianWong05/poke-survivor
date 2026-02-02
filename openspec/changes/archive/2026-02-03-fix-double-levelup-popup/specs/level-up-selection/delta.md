## MODIFIED Requirements

### Requirement: MainScene Integration
The `MainScene` SHALL launch `LevelUpScene` when a level-up occurs.

#### Scenario: Level up triggers selection
- **WHEN** XP collection causes a level-up
- **THEN** `LevelUpScene` is launched with `{ player, onComplete }`
- **AND** `UIManager.showLevelUpMenu()` is NOT called

#### Scenario: Resume after selection
- **WHEN** `onComplete` callback is invoked
- **AND** no additional levels are pending
- **THEN** `isLevelUpPending` is set to `false`
- **AND** `MainScene` resumes normal gameplay

#### Scenario: Multiple pending level ups
- **WHEN** `onComplete` callback is invoked
- **AND** the player has enough XP for another level
- **THEN** `processLevelUp()` is called to apply the previous level
- **AND** `startLevelUpSequence()` is called again immediately
- **AND** `MainScene` remains paused
