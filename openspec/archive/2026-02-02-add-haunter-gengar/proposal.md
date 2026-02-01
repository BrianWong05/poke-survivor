# Proposal: Add Haunter and Gengar Configurations

## Problem Statement
The game supports Gastly but lacks its evolved forms, Haunter and Gengar. The user wants to complete the Ghost evolution line with specific configurations.

## Proposed Solution
Implement `haunterConfig` and `gengarConfig` in separate files (`haunter.ts`, `gengar.ts`) within `src/game/entities/characters/`.

**Configuration Details:**
1.  **Haunter**:
    *   Stats: 140 HP, 265 Speed, 24 Base Damage.
    *   Assets: Uses `lick`, `shadowTagPassive`, `destinyBond`.
    *   Archetype: `archetype_shadow_stalker`.
2.  **Gengar**:
    *   Stats: 250 HP, 310 Speed, 45 Base Damage.
    *   Assets: Uses `lick`, `shadowTagPassive`, `destinyBond`.
    *   Archetype: `archetype_nightmare_weaver`.

## Impact Analysis
- **Codebase**: Adds two new files. Updates `registry.ts` and `gastly.ts`.
- **Gameplay**: Enables evolution progression for Gastly.
- **Risk**: Low. Pure configuration addition.
