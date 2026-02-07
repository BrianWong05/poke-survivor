## ADDED Requirements

### Requirement: Zoom Level Check
The user SHALL be able to see the current zoom level.

#### Scenario: Default Zoom
- **WHEN** the Level Editor loads
- **THEN** the zoom level SHALL be 100%

### Requirement: Zoom In
The user SHALL be able to increase the zoom level up to a maximum limit.

#### Scenario: Clicking Zoom In
- **WHEN** the user clicks the "Zoom In" button
- **THEN** the map view SHALL scale up
- **AND** the zoom level SHALL increase by a set step (e.g., 10%)

#### Scenario: Max Zoom Limit
- **WHEN** the zoom level is at the maximum (e.g., 200%)
- **AND** the user attempts to zoom in
- **THEN** the zoom level SHALL remain at the maximum

### Requirement: Zoom Out
The user SHALL be able to decrease the zoom level down to a minimum limit.

#### Scenario: Clicking Zoom Out
- **WHEN** the user clicks the "Zoom Out" button
- **THEN** the map view SHALL scale down
- **AND** the zoom level SHALL decrease by a set step

#### Scenario: Min Zoom Limit
- **WHEN** the zoom level is at the minimum (e.g., 50%)
- **AND** the user attempts to zoom out
- **THEN** the zoom level SHALL remain at the minimum

### Requirement: Mouse Wheel Zoom
The user SHALL be able to zoom using the mouse wheel while holding a modifier key.

#### Scenario: Ctrl + Wheel Up
- **WHEN** the user holds Ctrl (or Cmd) and scrolls the mouse wheel up
- **THEN** the zoom level SHALL increase

#### Scenario: Ctrl + Wheel Down
- **WHEN** the user holds Ctrl (or Cmd) and scrolls the mouse wheel down
- **THEN** the zoom level SHALL decrease

### Requirement: Interaction Accuracy
All map interactions (painting, erasing, selection) SHALL function correctly at any zoom level.

#### Scenario: Painting at 200% Zoom
- **WHEN** the zoom level is 200%
- **AND** the user clicks on a tile visual
- **THEN** the tile SHALL be placed at the correct grid coordinate corresponding to the visual click

#### Scenario: Painting at 50% Zoom
- **WHEN** the zoom level is 50%
- **AND** the user clicks on a tile visual
- **THEN** the tile SHALL be placed at the correct grid coordinate corresponding to the visual click
