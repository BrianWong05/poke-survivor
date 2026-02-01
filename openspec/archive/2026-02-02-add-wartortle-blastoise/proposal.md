# Proposal: Add Wartortle and Blastoise Configurations

## Problem Statement
The game supports Squirtle but lacks its evolved forms, Wartortle and Blastoise. The user wants to complete the Water evolution line with specific configurations.

## Proposed Solution
Implement `wartortleConfig` and `blastoiseConfig` in separate files (`wartortle.ts`, `blastoise.ts`) within `src/game/entities/characters/`.

**Configuration Details:**
1.  **Wartortle**:
    *   Stats: 320 HP, 160 Speed, 30 Base Damage.
    *   Assets: Uses `waterPulse`, `rainDishPassive`, `shellSmash`.
    *   Archetype: `archetype_shell_guardian`.
2.  **Blastoise**:
    *   Stats: 550 HP, 190 Speed, 55 Base Damage.
    *   Assets: Uses `waterPulse`, `rainDishPassive`, `shellSmash`.
    *   Archetype: `archetype_siege_fortress`.

## Impact Analysis
- **Codebase**: Adds two new files. Updates `registry.ts` and `squirtle.ts`.
- **Gameplay**: Enables evolution progression for Squirtle.
- **Risk**: Low. Pure configuration addition.
