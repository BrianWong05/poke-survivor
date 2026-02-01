# Proposal: Dynamic Character Registry

## Problem Statement
The current `registry.ts` relies on manual static imports for every Pokémon. This causes friction when adding new characters and leads to a bloated file.

## Proposed Solution
Refactor `registry.ts` to use Vite's `import.meta.glob` to dynamically discover and register all character configurations in the `src/game/entities/characters/` directory.

**Implementation Details:**
1.  Use `import.meta.glob('./*.ts', { eager: true })`.
2.  Filter out `registry.ts` and `types.ts`.
3.  Iterate through exports and register anything ending in `Config` (e.g., `pikachuConfig`).
4.  The map key will be the `id` field from the configuration object.

## Impact Analysis
- **Scalability**: New characters added to the folder are automatically registered.
- **Maintainability**: No more merge conflicts in `registry.ts`.
- **Bundle Size**: No impact (eager glob in Vite basically generates the static imports for you).
- **Risk**: Low, but requires ensuring all characters use the `Config` suffix consistently.
