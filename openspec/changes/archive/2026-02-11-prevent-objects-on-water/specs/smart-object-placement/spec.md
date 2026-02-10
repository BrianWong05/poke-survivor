# Spec: Smart Object Placement

## ADDED Requirements

### Requirement: Object Layer Awareness
The map generation system must respect all terrain layers when placing objects.

#### Scenario: Placing a Tree
- **WHEN** the generator attempts to place a tree at `(x, y)`
- **AND** the tile at `(x, y)` on the `Water` layer is not empty (i.e., is a water tile)
- **THEN** the generator must NOT place the tree at `(x, y)`

#### Scenario: Placing a Flower
- **WHEN** the generator attempts to place a flower at `(x, y)`
- **AND** the tile at `(x, y)` on the `Water` layer is not empty
- **THEN** the generator must NOT place the flower at `(x, y)`

### Requirement: Bridge Awareness
Objects must not block bridges.

#### Scenario: Placing a Tree on a Bridge
- **WHEN** the generator attempts to place a tree at `(x, y)`
- **AND** the tile at `(x, y)` on the `Bridges` layer is not empty (i.e., is a bridge tile)
- **THEN** the generator must NOT place the tree at `(x, y)`

#### Scenario: Placing a Flower on a Bridge
- **WHEN** the generator attempts to place a flower at `(x, y)`
- **AND** the tile at `(x, y)` on the `Bridges` layer is not empty
- **THEN** the generator must NOT place the flower at `(x, y)`
