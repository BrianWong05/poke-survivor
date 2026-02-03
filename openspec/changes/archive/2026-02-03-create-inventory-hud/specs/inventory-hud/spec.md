## ADDED Requirements

### Requirement: Inventory Data Access
The `PlayerInventory` system SHALL expose distinct collections for Active Weapons and Passive Items to facilitate UI rendering.

#### Scenario: Accessing Weapons
- **WHEN** the `weapons` property is accessed on `PlayerInventory`
- **THEN** it returns an array containing the currently active weapon (and any debug/extra weapons).

#### Scenario: Accessing Passives
- **WHEN** the `passives` property is accessed on `PlayerInventory`
- **THEN** it returns an array of all passive items currently held by the player.

### Requirement: HUD Rendering
The game SHALL display a visual HUD showing the player's current items during gameplay.

#### Scenario: Rendering Layout
- **WHEN** the HUD is rendered
- **THEN** it displays Active Weapons in the top row (y=0 relative to container).
- **THEN** it displays Passive Items in the bottom row (y=40 relative to container).

#### Scenario: Icon Display
- **WHEN** an item is rendered
- **THEN** its sprite is drawn at 32x32 size.
- **THEN** if the item object lacks a `spriteKey`, it uses the item's `id` to resolve the texture.

#### Scenario: Level Indicator
- **WHEN** an item has a level greater than 0
- **THEN** a text overlay displays the current level.
