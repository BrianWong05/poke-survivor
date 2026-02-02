## Why

Introduce the "Amulet Coin" passive item to allow players to increase their gold gain (`greed`). This provides more strategic depth and progression options during a run.

## What Changes

- **New Item**: Amulet Coin passive item.
    - **Effect**: Increases Gold Gain (`greed`) by +20% per level.
    - **Max Level**: 5 (Total +100% gold).
- **Player Stats**: Add a `greed` stat to the `Player` class to handle gold multipliers.
- **Gold Logic**: Update gold acquisition to factor in the `greed` multiplier.
- **Assets**: Download and load the Amulet Coin sprite.

## Capabilities

### New Capabilities
- `amulet-coin`: Implements the Amulet Coin item configuration and logic.

### Modified Capabilities
- `passive-stats`: Update player stat recalculation to include the `greed` multiplier.
- `passives`: Add the Amulet Coin requirement to the passives specification.

## Impact

- `src/game/entities/Player.ts`: `recalculateStats` and `gainGold` logic.
- `src/game/data/ItemData.ts`: New item entry.
- `src/game/scenes/Preloader.ts`: New asset loading.
- `public/assets/items/amulet_coin.png`: New asset file.
