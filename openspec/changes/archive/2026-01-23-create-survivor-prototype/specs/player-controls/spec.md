## ADDED Requirements

### Requirement: Keyboard Movement
The system SHALL allow the player to move using keyboard input on desktop devices.

#### Scenario: WASD keys movement
- **WHEN** the W key is pressed
- **THEN** the player moves upward
- **WHEN** the A key is pressed
- **THEN** the player moves left
- **WHEN** the S key is pressed
- **THEN** the player moves downward
- **WHEN** the D key is pressed
- **THEN** the player moves right

#### Scenario: Arrow keys movement
- **WHEN** any arrow key is pressed
- **THEN** the player moves in the corresponding direction

#### Scenario: Diagonal movement
- **WHEN** two perpendicular movement keys are pressed simultaneously
- **THEN** the player moves diagonally with normalized velocity

---

### Requirement: Touch Joystick Controls
The system SHALL provide a virtual joystick for player movement on touch devices.

#### Scenario: Joystick appears on mobile
- **WHEN** the game is loaded on a touch-capable device
- **THEN** a virtual joystick is rendered in the bottom-left corner of the screen

#### Scenario: Joystick controls movement
- **WHEN** the user drags the joystick in a direction
- **THEN** the player moves in that direction
- **AND** movement speed is proportional to joystick displacement

#### Scenario: Joystick release stops movement
- **WHEN** the user releases the joystick
- **THEN** the joystick returns to center
- **AND** player movement stops (if no keyboard input is active)

---

### Requirement: Input Priority
The system SHALL handle simultaneous keyboard and touch input gracefully.

#### Scenario: Keyboard takes priority
- **WHEN** keyboard input and joystick input are both active
- **THEN** the final movement vector is the sum of both inputs (clamped to max speed)

#### Scenario: No input means no movement
- **WHEN** no keyboard keys are pressed
- **AND** no joystick input is active
- **THEN** the player velocity is zero
