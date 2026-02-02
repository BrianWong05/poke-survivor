## Why

The "Lucky Egg" passive item adds a new strategic choice for players, allowing them to sacrifice an item slot for faster leveling. This aligns with standard survivor-like mechanics and traditional Pokémon item effects.

## What Changes

- **Asset Introduction**: New sprite for the Lucky Egg.
- **Item Definition**: New `lucky_egg` entry in `ItemData.ts` with level-based growth scaling.
- **Stat Recalculation**: Logic in `Player.ts` to calculate the total `growth` multiplier from the inventory.
- **Experience Logic**: Modification to `Player.gainExperience` to apply the `growth` multiplier.

## Capabilities

### New Capabilities
- `lucky-egg`: Core implementation of the Lucky Egg passive item, including level scaling and growth boost.

### Modified Capabilities
- `experience-system`: Requirements for calculating XP gain now include a variable `growth` multiplier provided by items.
- `passives`: Inclusion of the Lucky Egg item as a standard passive item.

## Impact

- `src/game/entities/Player.ts`: Primary logic for XP multiplication and stat management.
- `src/game/data/ItemData.ts`: Central item registry for game balance.
- `src/game/scenes/Preloader.ts`: Asset preloading.
- `public/assets/items/lucky_egg.png`: New UI asset.
