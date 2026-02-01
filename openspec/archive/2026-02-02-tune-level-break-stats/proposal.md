# Proposal: Tune Level Break Stats

## Problem Statement
Single-stage Pokémon fall behind late-game compared to 3-stage evolutions due to lack of stat multipliers from evolution.

## Proposed Solution
Significantly buffet the "Level Break" (fallback evolution) stats to ensure viability.
Target a 2.5x total damage multiplier by Level 40.

**Tuned Values:**
- **Might**: +0.75 (acc. +1.5 at Lv 40)
- **HP**: +150 (acc. +300 at Lv 40)
- **Defense**: +3 (acc. +6 at Lv 40)

## Impact Analysis
- **Codebase**: Modifies `Player.ts`.
- **Gameplay**: Makes single-stage runs (e.g. Snorlax, Pikachu without Raichu stone) viable.
- **Risk**: Low. Purely numerical tuning.
