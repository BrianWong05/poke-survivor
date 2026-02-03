## Why

The level-up screen currently uses a generic circle with a letter as a placeholder for item and weapon icons. Adding actual sprites will improve the visual quality, immersion, and clarity of the selection process, making it easier for players to identify upgrades at a glance.

## What Changes

- **Modified**: Update `LevelUpOption` interface to include a `spriteKey` field.
- **Modified**: Update `LevelUpManager.getOptions()` to populate the `spriteKey` for all option types (weapons and passive items).
- **Modified**: Update `LevelUpScene.ts` to render the Phaser sprite associated with the `spriteKey` instead of the text-based placeholder.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `level-up-selection`: Update requirements to include mandatory sprite rendering for all selection cards.

## Impact

- `src/game/systems/LevelUpManager.ts`: Interface and logic changes to provide sprite information.
- `src/game/scenes/LevelUpScene.ts`: UI rendering logic changes to display sprites.
- `src/game/data/ItemData.ts`: (Reference) Ensure `spriteKey` is available for all items.
- `src/game/entities/weapons/index.ts`: (Reference) Ensure `spriteKey` or `weaponConfig.id` can be used for weapon sprites.
