## ADDED Requirements

### Requirement: Camera starts centered
The camera SHALL be centered on the player's spawn position at the start of the scene.

#### Scenario: Initial camera position
- **WHEN** the scene initialization is complete
- **THEN** the camera viewport center SHALL match the player's world position
- **AND** there SHALL be no visible panning from the world origin (0,0)
