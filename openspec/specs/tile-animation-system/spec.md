## ADDED Requirements

### Requirement: Independent Animation Loops
The `TileAnimator` SHALL support multiple animations running with independent timers and speeds, updated once per frame regardless of the number of layers.

#### Scenario: Different Speeds
- **WHEN** Animation A has duration 100ms and Animation B has duration 200ms
- **THEN** Animation A updates twice as often as Animation B.

#### Scenario: Single Update per Frame
- **WHEN** `update` is called multiple times per frame (e.g. for multiple layers)
- **THEN** The internal timers SHALL only advance once per frame.

### Requirement: Frame Wrapping
Animations must loop back to the start frame after the last frame.
#### Scenario: End of Loop
- **WHEN** An animation with 3 frames (Ids: 10, 11, 12) is at frame 12
- **THEN** The next update sets the tile to frame 10.

### Requirement: Layer Integration
The system SHALL update tiles on specific tilemap layers using the current animation state.

#### Scenario: Update Call
- **WHEN** `updateLayer` is called for a specific layer
- **THEN** The layer is scanned, and matching tiles SHALL be updated based on the current animation frame.

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