## Context

The game currently lacks a way to increase gold gain during a run. The Amulet Coin is a standard Pokemon item that solves this by introducing a "greed" mechanic.

## Goals / Non-Goals

**Goals:**
- Implement the Amulet Coin passive item with a leveling system.
- Introduce a `greed` multiplier for gold acquisition.
- Ensure gold gain is rounded up to the nearest integer.

**Non-Goals:**
- Change the base gold value of existing coins.
- Implement other gold-related items (e.g., Lucky Egg for EXP).

## Decisions

### 1. New Player Stat: `greed`
- **Rationale**: Adding a dedicated stat allows for consistent calculation and future extensibility (e.g., other items or buffs that affect gold gain).
- **Implementation**: Initialize `greed` to 1.0 (100%) in `Player.recalculateStats()`.

### 2. Multiplier Calculation
- **Formula**: `totalGreed = baseGreed + (itemLevel * 0.20)`
- **Rationale**: Each level provides a flat 20% increase, reaching 100% (double gold) at level 5.

### 3. Gold Gain Hook
- **Logic**: Modify `gainGold(amount)` to use the `greed` multiplier.
- **Rounding**: Use `Math.ceil()` to ensure that even small amounts receive a bonus (e.g., 1 gold becomes 2 gold even with a 1.2x multiplier).

## Risks / Trade-offs

- **[Risk] Overflow/Balance**: Doubling gold might accelerate progression too much. → [Mitigation] Limit max level to 5 and monitor game balance.
- **[Risk] Float Precision**: Simple addition might lead to float errors (e.g., 1.99999). → [Mitigation] Use `Math.ceil()` for the final gold amount.
