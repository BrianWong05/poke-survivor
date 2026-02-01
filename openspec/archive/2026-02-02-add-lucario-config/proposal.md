# Proposal: Add Lucario Configuration

## Problem Statement
The game supports Riolu but lacks its evolved form, Lucario. The user wants to complete the Fighting evolution line.

## Proposed Solution
Implement `lucarioConfig` in `src/game/entities/characters/lucario.ts`.
Update `riolu.ts` to link evolution to Lucario.

**Configuration Details:**
1.  **Lucario**:
    *   Stats: 240 HP, 250 Speed, 40 Base Damage.
    *   Assets: Reuse Riolu's `innerFocusPassive`, `weapons.auraSphere`, and `ultimate: boneRush` (Correcting user request "Force Palm" and "Aura Sphere Ult" to match Riolu's actual existing assets).
    *   Archetype: `archetype_aura_guardian`.
    *   Evolution: Final form (no further evolution).

**Note on Architecture:**
User requested updating `PokemonData.ts`, but we are following the decentralized config pattern (`evolution` field in character files) established in previous changes. Evolution logic will be handled via `riolu.ts`.

## Impact Analysis
- **Codebase**: Adds `lucario.ts`, updates `riolu.ts` and `registry.ts`.
- **Gameplay**: Enables Riolu -> Lucario evolution.
- **Risk**: Low.
