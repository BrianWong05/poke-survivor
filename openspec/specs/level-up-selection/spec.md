# level-up-selection Specification

## Purpose
TBD - created by archiving change add-level-up-selection. Update Purpose after archive.
## Requirements
### Requirement: Item Registry Dynamic Loading
The system SHALL dynamically load all Item classes using Vite's `import.meta.glob`.

#### Scenario: Registry initialization
- **WHEN** the game initializes
- **THEN** `ITEM_REGISTRY` contains all valid Item classes from `items/passive/*.ts`
- **AND** non-Item exports are filtered out
- **AND** the registry is available for pool construction

---

### Requirement: Level Up Option Pool Construction
The `LevelUpManager.getOptions()` method SHALL construct a pool of available options for the player.

#### Scenario: Upgradable items added to pool
- **WHEN** `getOptions(player, count)` is called
- **AND** player has an item where `item.level < item.maxLevel`
- **THEN** that item is added to the pool as type `'UPGRADE'`
- **AND** the option includes the existing instance reference

#### Scenario: New items added to pool
- **WHEN** `getOptions(player, count)` is called
- **AND** an Item class exists in `ITEM_REGISTRY` that the player does not have
- **AND** the player has fewer than 6 passive items
- **THEN** that Item class is added to the pool as type `'NEW'`

#### Scenario: Pool shuffling and selection
- **WHEN** the pool is constructed
- **THEN** it is shuffled randomly
- **AND** the first `count` items are returned
- **AND** if `pool.length < count`, the entire pool is returned

#### Scenario: Empty pool handling
- **WHEN** `getOptions(player, count)` is called
- **AND** all items are at max level
- **AND** no new items can be acquired
- **THEN** an empty array is returned

---

### Requirement: Slot Limits
The system SHALL enforce slot limits when determining available new items.

#### Scenario: Passive slot limit
- **WHEN** constructing the new items pool
- **AND** player has 6 passive items
- **THEN** no new passive items are added to the pool

#### Scenario: Weapon slot limit
- **WHEN** constructing the new items pool
- **AND** player has 6 weapon items
- **THEN** no new weapon items are added to the pool

---

### Requirement: Level Up Selection Scene
The system SHALL provide a Phaser Scene for displaying and selecting level-up options.

#### Scenario: Scene initialization
- **WHEN** `LevelUpScene` is launched with `{ player, onComplete }`
- **THEN** the scene stores the player reference
- **AND** the scene stores the onComplete callback

#### Scenario: Game pauses during selection
- **WHEN** `LevelUpScene.create()` is called
- **THEN** `MainScene` physics are paused
- **AND** enemies cannot damage the player
- **AND** the game loop is suspended

#### Scenario: Selection cards displayed
- **WHEN** `LevelUpScene.create()` is called
- **THEN** 3-4 selection cards are displayed
- **AND** each card shows the item name
- **AND** each card shows "New!" or "Lv.X → Lv.Y"
- **AND** each card displays the item's sprite/icon
- **AND** each card is interactive (pointer events)

---

### Requirement: Sprite Fallback
The system SHALL provide a visual fallback if a specific item sprite is missing from the texture cache.

#### Scenario: Missing sprite texture
- **WHEN** a selection card is being rendered
- **AND** the `spriteKey` is not present in the Phaser texture cache
- **THEN** the card SHALL display a default placeholder icon (e.g., a circle with the item's initial)
- **AND** no error SHALL be thrown by the scene

#### Scenario: Option selected
- **WHEN** a selection card is clicked
- **THEN** `LevelUpManager.selectOption()` is called
- **AND** the scene is closed
- **AND** `MainScene` resumes
- **AND** the `onComplete` callback is invoked

#### Scenario: Skip button
- **WHEN** the Skip button is clicked
- **THEN** no selection is applied
- **AND** the scene is closed
- **AND** `MainScene` resumes

#### Scenario: Reroll button
- **WHEN** the Reroll button is clicked
- **THEN** `getOptions()` is called again
- **AND** the selection cards are refreshed with new options

---

### Requirement: Selection Application
The `LevelUpManager.selectOption()` method SHALL apply the selected option.

#### Scenario: Upgrade selection
- **WHEN** `selectOption()` is called with type `'UPGRADE'`
- **THEN** `option.instance.levelUp(ctx)` is called
- **AND** the item level increases

#### Scenario: New item selection
- **WHEN** `selectOption()` is called with type `'NEW'`
- **THEN** a new instance of `option.itemClass` is created
- **AND** the item is added to `player.items`
- **AND** `item.onAcquire(ctx)` is triggered via `levelUp()`

---

### Requirement: MainScene Integration
The `MainScene` SHALL launch `LevelUpScene` when a level-up occurs.

#### Scenario: Level up triggers selection
- **WHEN** XP collection causes a level-up
- **THEN** `LevelUpScene` is launched with `{ player, onComplete }`
- **AND** `UIManager.showLevelUpMenu()` is NOT called

#### Scenario: Resume after selection
- **WHEN** `onComplete` callback is invoked
- **AND** no additional levels are pending
- **THEN** `isLevelUpPending` is set to `false`
- **AND** `MainScene` resumes normal gameplay

#### Scenario: Multiple pending level ups
- **WHEN** `onComplete` callback is invoked
- **AND** the player has enough XP for another level
- **THEN** `processLevelUp()` is called to apply the previous level
- **AND** `startLevelUpSequence()` is called again immediately
- **AND** `MainScene` remains paused

