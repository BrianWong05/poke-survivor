# Spec: Navigate to Spawn

## ADDED Requirements

### Requirement: Double-Click Navigation
The user must be able to quickly navigate to the spawn point from the level editor sidebar.

#### Scenario: Double-Click Spawn Tool
- **WHEN** the user double-clicks the "SPAWN" tool button in the sidebar
- **AND** a spawn point is set on the map
- **THEN** the editor viewport must scroll to center the spawn point
- **AND** the transition should be smooth

#### Scenario: Double-Click Spawn Tool (No Spawn Point)
- **WHEN** the user double-clicks the "SPAWN" tool button in the sidebar
- **AND** no spawn point is set on the map
- **THEN** no action is taken (viewport remains unchanged)
