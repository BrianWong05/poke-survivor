# mechanics Specification

## Purpose
TBD - created by archiving change implement-lucario-kit. Update Purpose after archive.
## Requirements
### Requirement: Enemies MUST display critical hit visuals
The game MUST provide clear visual feedback when an enemy takes critical damage.

#### Scenario: Critical hit visual feedback
When `takeDamage` is called with `isCrit: true`, a floating text "CRIT!" MUST appear above the enemy in red color.

### Requirement: Critical hits MUST instakill non-boss enemies
Critical hits on standard enemies MUST result in immediate death to reward precision/luck.

#### Scenario: Instakill non-boss
When a standard enemy (non-boss) receives a critical hit, the enemy's HP MUST be set to 0 immediately.

### Requirement: Critical hits MUST deal double damage to bosses
Bosses MUST take increased damage from critical hits without instantly dying.

#### Scenario: Boss critical damage
When a Boss-type enemy receives a critical hit, the damage dealt MUST be 2x the original amount. The boss MUST NOT instantly die unless the damage is sufficient to reduce HP to 0.

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

