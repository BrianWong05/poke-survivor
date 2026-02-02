## ADDED Requirements

### Requirement: Magnet Passive Item
The Magnet item MUST be registered as a passive item in the game's item system.
- **ID**: `magnet`
- **Type**: `passive`
- **Effect**: Increases pickup range.

#### Scenario: Item Registration
- **WHEN** the item data is initialized
- **THEN** the `magnet` item is included in the available passive items list.
