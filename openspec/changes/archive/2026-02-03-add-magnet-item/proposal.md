## Why

The Magnet item is a classic "survivor" genre item that improves quality of life by increasing the radius at which the player collects experience gems and coins. This allows for easier harvesting of resources without requiring precise movement over every drop.

## What Changes

- **New Asset**: Download and integrate the Magnet sprite.
- **Item Configuration**: Add `MAGNET` to `ItemData.ts` with a `magnet` stat modifier.
- **Player Logic**:
    - Add a `baseMagnetRadius` property to the `Player` class.
    - Update `recalculateStats()` to compute the final `magnetRadius` based on the Magnet item level.
    - Update collection logic to use the dynamic `magnetRadius`.

## Capabilities

### New Capabilities
- `magnet`: Defines the requirement for the Magnet passive item, including level-based scaling (+30% range per level) and visual representation.

### Modified Capabilities
- `passives`: Add the Magnet item as a recognized passive item in the game's item system.

## Impact

- `src/game/scenes/Preloader.ts`: Loaded asset.
- `src/game/data/ItemData.ts`: Item definition.
- `src/game/entities/Player.ts`: Radius calculation and collection logic.
