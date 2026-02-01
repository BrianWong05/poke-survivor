## Context
The game requires a progression system where Pokémon can evolve into stronger forms. Prior to this, stats were static or only modified by items. This change introduces a "Forward Linking" database (`PokemonData`) and integrates evolution logic into the `Player` entity, specifically triggered by chest interactions.

## Goals / Non-Goals
**Goals:**
- Implement a centralized `PokemonData` database for stats and evolution paths.
- Enable Pikachu -> Raichu evolution upon opening chests at specific levels.
- Provide visual and statistical feedback upon evolution.
- Ensure fallback buffs if evolution is not possible but conditions are met.

**Non-Goals:**
- Branching evolution paths (current system supports linear, though DB structure allows branching).
- De-evolution or temporary forms (evolutions are permanent for the run).
- Persistent evolution across different game runs (session-based).

## Decisions

### Centralized Data vs Class Inheritance
**Decision**: Use a static data object (`POKEMON_DB`) in `PokemonData.ts` rather than separate classes for each Pokemon.
**Rationale**: Easier to manage data-driven stats and evolution links. Allows `Player` class to remain generic and just swap "forms" by looking up data.
**Alternatives**: Subclasses for `Pikachu`, `Raichu`. Rejected to avoid class explosion and keep entity logic unified.

### Chest Trigger Integration
**Decision**: check for evolution inside `attemptChestEvolution()` called during chest interaction.
**Rationale**: Ties progression to a rewarding moment (chest opening).
**Alternatives**: Level-up screen trigger. Rejected as per user request for Chest trigger.

### Asset Management
**Decision**: Switch texture using `setTexture(formId)`.
**Rationale**: Simple Phaser mechanic. Assumes texture keys match IDs ('pikachu', 'raichu').

## Risks / Trade-offs

- **Stat Overwrites**:
    - *Risk*: Overwriting `maxHp` might reset HP upgrades from items if not carefully calculated (e.g. if items add to base).
    - *Mitigation*: The requirement explicitly says "Overwrite Stats". We will implement direct assignment as requested, implying evolution sets a new "base". If passive items add top-level stats, they might need re-application or we accept they are incorporated/reset. (Clarification: User said "Overwrite Stats: this.maxHp = newStats.maxHp". We will follow this strictly).

- **Asset Availability**:
    - *Risk*: 'raichu' texture might not be loaded.
    - *Mitigation*: Ensure keys match loaded assets or fail gracefully (log warning).
