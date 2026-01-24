# asset-pipeline Specification

## Purpose
TBD - created by archiving change add-asset-pipeline. Update Purpose after archive.
## Requirements
### Requirement: Asset Download Script

The system SHALL provide a Python script (`scripts/download_assets.py`) that downloads PMD-style Pokémon sprites from PMDCollab and processes them into Phaser-compatible sprite sheets.

#### Scenario: Download sprites for default Pokémon list
- **GIVEN** the script is executed without arguments
- **WHEN** the default ID list `[1, 4, 7, 25, 133, 150]` is used
- **THEN** sprites for Bulbasaur, Charmander, Squirtle, Pikachu, Eevee, and Mewtwo are downloaded and processed

#### Scenario: Download sprites for custom Pokémon list
- **GIVEN** the user wants to add more Pokémon
- **WHEN** the ID list is modified in the script
- **THEN** sprites for all listed IDs are downloaded and processed

#### Scenario: Handle missing sprites gracefully
- **GIVEN** a Pokémon ID does not have a Walk animation
- **WHEN** the script attempts to process that ID
- **THEN** a warning is logged and the ID is skipped

---

### Requirement: Sprite Sheet Processing

The system SHALL use Pillow to extract Walk animation frames and stitch them into horizontal sprite strips.

#### Scenario: Extract and stitch Walk animation frames
- **GIVEN** an AnimData.xml file specifying Walk animation metadata
- **AND** an Anim-Front.png sprite sheet
- **WHEN** the script processes the sprite
- **THEN** Walk frames are extracted and combined into a single horizontal PNG strip

#### Scenario: Save processed sprites with correct naming
- **GIVEN** a Pokémon with ID 25 (Pikachu)
- **WHEN** the sprite is processed
- **THEN** the output file is saved as `public/assets/sprites/25.png`

---

### Requirement: Manifest Generation

The system SHALL generate a `public/assets/manifest.json` file containing metadata for all processed sprites.

#### Scenario: Generate manifest with all required fields
- **GIVEN** sprites have been downloaded and processed
- **WHEN** the manifest is generated
- **THEN** each entry contains: `id`, `name`, `path`, `frameWidth`, `frameHeight`, `frameCount`

#### Scenario: Manifest is valid JSON
- **GIVEN** the manifest file is generated
- **WHEN** loaded by a JSON parser
- **THEN** it parses without errors

---

### Requirement: Dependencies Specification

The system SHALL include a `scripts/requirements.txt` file listing all Python dependencies.

#### Scenario: Requirements file includes necessary packages
- **GIVEN** the requirements.txt file exists
- **WHEN** read by pip
- **THEN** it includes `requests` and `Pillow`

