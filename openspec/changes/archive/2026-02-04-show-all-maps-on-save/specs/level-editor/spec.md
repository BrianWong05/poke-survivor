## ADDED Requirements

### Requirement: Save Map with Context
The Level Editor SHALL allow the user to save the current map using a custom UI that displays existing maps.

#### Scenario: Opening the Save Modal
- **WHEN** the user clicks the "Save" button
- **THEN** a modal SHALL appear showing a list of existing map names
- **AND** a text input SHALL be provided for the new map name

#### Scenario: Selecting existing map to overwrite
- **WHEN** the user clicks an existing map name in the Save Modal list
- **THEN** the map name SHALL be populated in the input field

#### Scenario: Overwrite confirmation
- **WHEN** the user attempts to save a map with a name that already exists
- **THEN** the system SHALL prompt for confirmation before proceeding with the save
