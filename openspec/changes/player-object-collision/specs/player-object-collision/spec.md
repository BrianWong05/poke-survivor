## ADDED Requirements

### Requirement: Solid Object Collision
The system SHALL prevent the player's physics body from entering tiles that are occupied by non-empty tiles on the "Objects" layer of the map.

#### Scenario: Collision with static object
- **WHEN** the player attempts to move into a tile containing an object (e.g., a tree or wall)
- **THEN** the player's movement SHALL be blocked by the object tile
- **AND** the player's velocity SHALL NOT result in them overlapping significantly with the object tile

### Requirement: Ground Layer Traversal
The system SHALL allow the player's physics body to freely enter tiles on the "Ground" layer of the map.

#### Scenario: Normal movement on ground
- **WHEN** the player moves over a tile on the ground layer that has no corresponding object on the objects layer
- **THEN** the player SHALL move at their normal speed without being blocked
