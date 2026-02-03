## Why

The current 'Iron' item has a sprite that is too similar to the 'HP Up' item, causing player confusion. Replacing 'Iron' with 'Assault Vest' provides a distinct visual identity while maintaining the gameplay function of increasing defense.

## What Changes

- **Renaming**: Replace all references to "Iron" with "Assault Vest" in the codebase.
- **Asset Replacement**: Replace the `iron.png` asset (or its reference) with `assault_vest.png`.
- **Class Refactor**: Rename `Iron.ts` to `AssaultVest.ts` and update the class name and properties.
- **Data Update**: Update `ItemData.ts` and `Preloader.ts` to use the new "Assault Vest" naming and asset paths.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `iron-passive`: Rename to `assault-vest-passive` and update requirements to reflect the new item identity.

## Impact

- `src/game/entities/items/passive/Iron.ts`: Renamed and modified.
- `src/game/data/ItemData.ts`: Item ID and metadata updated.
- `src/game/scenes/Preloader.ts`: Asset loading path updated.
- `public/assets/items/`: New sprite `assault_vest.png` required (replaces `iron.png`).
- `src/game/systems/DevDebugSystem.ts`: Debug commands renamed.
