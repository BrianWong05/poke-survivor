# Player Controls Specs

## ADDED Requirements

### Requirement: Pause Game
The system SHALL allow the player to pause and resume the active game session.

#### Scenario: Pause with ESC key
Given the game is running (not paused),
When the player presses the ESC key,
Then the game physics and simulation MUST pause,
And a "PAUSED" indicator MUST be displayed.

#### Scenario: Resume with ESC key
Given the game is currently paused,
When the player presses the ESC key,
Then the game physics and simulation MUST resume,
And the "PAUSED" indicator MUST be hidden.
