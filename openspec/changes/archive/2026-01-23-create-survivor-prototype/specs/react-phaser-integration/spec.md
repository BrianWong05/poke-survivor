## ADDED Requirements

### Requirement: Phaser Lifecycle Management
The system SHALL properly initialize and destroy the Phaser game instance within React's component lifecycle.

#### Scenario: Game initialization on mount
- **WHEN** the GameCanvas component mounts
- **THEN** a new Phaser.Game instance is created
- **AND** the game is attached to the component's DOM container

#### Scenario: Game cleanup on unmount
- **WHEN** the GameCanvas component unmounts
- **THEN** the Phaser.Game instance is destroyed
- **AND** all event listeners are removed
- **AND** no memory leaks occur

---

### Requirement: React State Updates from Phaser
The system SHALL communicate game state changes from Phaser to React via event callbacks.

#### Scenario: Score update propagation
- **WHEN** the player collects an XP gem in Phaser
- **THEN** Phaser emits a score update event
- **AND** React receives the new score value
- **AND** the HUD component re-renders with the updated score

#### Scenario: HP update propagation
- **WHEN** the player takes damage in Phaser
- **THEN** Phaser emits an HP update event
- **AND** React receives the new HP value
- **AND** the HUD component re-renders with the updated HP

#### Scenario: Game over propagation
- **WHEN** player HP reaches zero in Phaser
- **THEN** Phaser emits a game-over event
- **AND** React displays a game-over overlay

---

### Requirement: HUD Overlay Rendering
The system SHALL render a transparent HTML overlay above the Phaser canvas for UI elements.

#### Scenario: HUD displays current state
- **WHEN** the game is running
- **THEN** the HUD displays:
  - Current HP (as a bar or number)
  - Current Score (as a number)

#### Scenario: HUD is non-interactive with game
- **WHEN** the user clicks on the HUD overlay
- **THEN** click events pass through to the game canvas where appropriate
- **AND** the HUD does not intercept game input (except designated UI buttons)

---

### Requirement: Container Layout
The system SHALL position the Phaser canvas and React overlays in a properly layered container.

#### Scenario: Canvas fills container
- **WHEN** the GameCanvas component renders
- **THEN** the Phaser canvas fills its parent container
- **AND** the canvas maintains proper aspect ratio or stretches to fill

#### Scenario: HUD overlays canvas
- **WHEN** both canvas and HUD are rendered
- **THEN** the HUD is positioned absolutely above the canvas
- **AND** the HUD has a transparent background
