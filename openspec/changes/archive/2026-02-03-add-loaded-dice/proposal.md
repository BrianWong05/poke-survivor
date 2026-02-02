## Why

The player needs a way to scale the number of projectiles fired by weapons to effectively manage increasing enemy density. The "Loaded Dice" passive item introduces this mechanic, allowing for projectile count scaling that was previously unavailable as a passive stat.

## What Changes

- **Asset Addition**: Download and register the `loaded_dice.png` sprite.
- **Item Configuration**: Define the `LOADED_DICE` config in `ItemData.ts` as a passive item with a max level of 2.
- **Player Stats**: Introduce an `amount` stat to the `Player` class that tracks extra projectiles.
- **Weapon Logic**: Modify `Weapon.fire()` to account for the player's `amount` stat, spawning multiple projectiles with a spread offset.

## Capabilities

### New Capabilities
- `loaded-dice`: Implements the Loaded Dice passive item data and visual assets.

### Modified Capabilities
- `passive-stats`: Update to include the `amount` (projectile count) stat logic in player recalculation.
- `weapon-system`: Update `Weapon.fire()` to support firing multiple projectiles based on player stats with a configurable spread.

## Impact

- `src/game/scenes/Preloader.ts`: New asset loading.
- `src/game/data/ItemData.ts`: New item registration.
- `src/game/entities/Player.ts`: New stat calculation logic.
- `src/game/items/Weapon.ts`: Firing loop and spread calculations.
