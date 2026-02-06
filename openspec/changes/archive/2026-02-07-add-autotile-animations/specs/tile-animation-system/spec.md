## ADDED Requirements

### Requirement: Environmental Animations Registry
The system SHALL register specific environmental animations for water currents and seaweed to enable their use in the Level Editor and game scenes.

#### Scenario: Register Water Currents
- **WHEN** the game initializes the TileAnimator
- **THEN** the "Water current east", "Water current north", "Water current south", and "Water current west" animations MUST be registered with 8 frames and 150ms duration.

#### Scenario: Register Seaweed
- **WHEN** the game initializes the TileAnimator
- **THEN** the "Seaweed dark" and "Seaweed light" animations MUST be registered with 4 frames and 250ms duration.

#### Scenario: Register Black Animation
- **WHEN** the game initializes the TileAnimator
- **THEN** the "Black" animation MUST be registered with 4 frames and 250ms duration.
