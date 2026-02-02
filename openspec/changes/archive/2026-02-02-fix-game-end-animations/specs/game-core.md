## MODIFIED Requirements

### Requirement: Player Health System
The system SHALL track player health and end the game when health reaches zero.

#### Scenario: Player takes damage
- **WHEN** an enemy collides with the player
- **THEN** the player's HP is reduced
- **AND** a brief invincibility period is granted

#### Scenario: Player dies
- **WHEN** player HP reaches 0
- **THEN** the game transitions to a game-over state
- **AND** all gameplay animations, physics, and tweens MUST stop immediately
- **AND** the Game Over UI is displayed
