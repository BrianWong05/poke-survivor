## Why

The player currently has limited options for increasing direct damage output via passive items. Adding the **Muscle Band** (力量頭帶) provides a clear progression path for offensive builds, aligning with classic Pokémon mechanics and improving gameplay variety.

## What Changes

- **New Asset**: Download and integrate the official Muscle Band sprite.
- **New Item**: Implement `MUSCLE_BAND` configuration with offensive stats.
- **Stat Buff**: Implement logic to increase Player Damage (`might`) by 10% per level of Muscle Band acquired.
- **Max Level**: The item will have a maximum level of 5, providing a total of +50% `might`.

## Capabilities

### New Capabilities
- `muscle-band`: Introduces the Muscle Band passive item that scales player damage (`might`) linearly with item level.

### Modified Capabilities
- `item-registry`: (Implicit) Update to include the new passive item.
- `stat-calculation`: (Implicit) Ensure `might` correctly incorporates passive item bonuses.

## Impact

- `Preloader.ts`: Asset loading for the new sprite.
- `ItemData.ts` (or `PassiveData.ts`): New item configuration object.
- `Player.ts`: Logic to recalculate `might` based on active passive items.
