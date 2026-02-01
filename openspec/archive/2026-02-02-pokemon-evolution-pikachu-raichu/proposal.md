## Why

Players currently lack a sense of progression and power scaling tied to their character's form. Implementing a Pokémon Evolution System will allow Pikachu to evolve into Raichu, providing tangible stat boosts and visual feedback, enhancing the gameplay loop and character depth using a Forward Linking database approach.

## What Changes

- Implement `PokemonData.ts` as a centralized database for stats and evolution paths (NextFormId).
- Update `Player.ts` to track `evolutionStage`, `formId`, and `might`.
- Add `attemptChestEvolution()` logic to `Player.ts` triggered by opening a chest.
- Implement evolution eligibility checks (Level 20 for Stage 1, Level 40 for Stage 2).
- Add branching logic for successful evolution (texture change, stat overwrite) and fallback boosts (if no evolution).
- Visual feedback using Tweens for evolution flash/scale and power-up effects.
- Integrate `might` into damage calculations and add a full heal helper.

## Capabilities

### New Capabilities
- `evolution-system`: Core system for defining Pokémon stats, evolution paths, and handling the evolution process during gameplay.

### Modified Capabilities
<!-- No modified capabilities checking existing specs -->

## Impact

- **Code**: `src/game/data/PokemonData.ts` (New), `src/game/entities/Player.ts` (Modified).
- **Gameplay**: Chest opening mechanic now triggers evolution checks. Damage calculation logic updated.
- **Visuals**: Player sprite changes upon evolution; visual effects added for evolution events.
