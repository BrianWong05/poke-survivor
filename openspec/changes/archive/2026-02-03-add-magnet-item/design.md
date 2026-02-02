## Context

The player currently has a hardcoded or simple pickup range. Introducing the Magnet item requires a more formal handling of this stat to allow for modifiers.

## Goals / Non-Goals

**Goals:**
- Implement the `magnet` passive item with level-based range bonuses.
- Ensure the pickup radius calculation is centralized in `Player.ts`.
- Use a dynamic distance check for all collectibles.

**Non-Goals:**
- Adding visual indicators for the pickup radius (can be added in a future pass).

## Decisions

### 1. Stat Multiplier vs. Additive Bonus
- **Decision**: Use a multiplier (+30% per level).
- **Rationale**: Multipliers feel more impactful in the mid-to-late game and follow the pattern established by other items like `Amulet Coin`.

### 2. Base Radius Storage
- **Decision**: Define `baseMagnetRadius` in `Player.ts`.
- **Rationale**: Keeps the player's core attributes localized.

## Risks / Trade-offs

- **Risk**: A very large radius might feel overpowered or cause performance issues if checking too many objects.
- **Mitigation**: Capped at Level 5 (+150%) and standard distance calculations in Phaser are efficient.
