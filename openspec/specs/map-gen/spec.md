## ADDED Requirements

### Requirement: Map Data Generation
The system must provide an automated way to generate the 300x300 outdoor map file.

#### Scenario: Generate Outdoor Map Script
- **WHEN** the developer runs `npx tsx scripts/generate_outdoor_map.ts`
- **THEN** a file `src/assets/maps/outdoor.json` is created or overwritten.
- **AND** the file contains valid JSON matching `CustomMapData` interface.
- **AND** the map dimensions are exactly 300x300 tiles.
- **AND** the map references the `Outside.png` tileset.

### Requirement: Outdoor Map Content
The generated map must simulate an outdoor environment suitable for gameplay.

#### Scenario: Verify Map Features
- **WHEN** the map is loaded in the game or editor
- **THEN** it displays a base layer of Grass.
- **AND** it contains Lakes (Water tiles) with collision enabled.
- **AND** it contains Trees and Rocks with collision enabled.
- **AND** path tiles are present and traversable.
