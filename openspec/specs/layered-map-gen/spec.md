## ADDED Requirements

### Requirement: Layered Map Output
The map generator MUST output a JSON object containing a `layers` array instead of top-level `ground` and `objects` grids.

#### Scenario: Map Generation
- **WHEN** `generateOutdoorMap` is called
- **THEN** The output JSON includes `layers` with at least "Ground", "Water", "Bridges", "Decorations", "Objects".
- **AND** The "Water" layer has `collision: true`.
- **AND** The "Objects" layer has `collision: true`.
- **AND** The "Ground", "Bridges", "Decorations" layers have `collision: false` (or undefined).

### Requirement: Lake Collision
Lakes generated on the map MUST obstruct player movement.

#### Scenario: Player tries to walk on water
- **WHEN** The player character moves towards a lake tile
- **THEN** The player is stopped by collision.

### Requirement: Bridge Walkability
Bridges generated over lakes MUST be walkable.

#### Scenario: Player crosses a bridge
- **WHEN** The player character moves onto a bridge tile over water
- **THEN** The player traverses the bridge without collision.
- **AND** The water is visible continuously underneath/around the bridge.
