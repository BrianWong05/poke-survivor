## ADDED Requirements

### Requirement: Bridge Placement Logic
The system SHALL procedurally place bridges over water to connect separated landmasses.

#### Scenario: Basic Bridge Placement
- **WHEN** the map generation reaches the bridge phase
- **THEN** scan for horizontal and vertical water gaps between ground tiles.
- **AND** place bridge tiles to span the gap if the length is within the allowed range (e.g., 2-6 tiles).

### Requirement: Bridge Types
The system SHALL support multiple visual styles of bridges based on available tiles.

#### Scenario: Horizontal Bridges
- **WHEN** a horizontal gap is detected
- **THEN** use horizontal bridge tiles (Left, Middle, Right).

#### Scenario: Vertical Bridges
- **WHEN** a vertical gap is detected
- **THEN** use vertical bridge tiles (Top, Middle, Bottom).

#### Scenario: Platforms
- **WHEN** a gap is short (e.g., 1-2 tiles) or specifically selected for variety
- **THEN** use platform/plank tiles instead of full bridges.

### Requirement: Bridge Validity
Bridges SHALL only be placed in valid locations to ensure walkability and visual correctness.

#### Scenario: Connection to Ground
- **WHEN** a bridge is placed
- **THEN** both ends MUST connect to a walkable ground tile (Grass, Dirt, Path).
- **AND** the bridge tiles themselves MUST be set as walkable (collision-free).
