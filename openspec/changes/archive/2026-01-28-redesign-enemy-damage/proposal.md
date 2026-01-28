# Redesign Enemy Damage (Continuous Contact Style)

## Goal
Redesign the combat pacing for "Continuous Contact Damage" (High frequency, low damage).
Enemies will deal **1 damage** per hit, but with a much shorter invulnerability window (**0.1s**).

## Impact
- **Gameplay Feel:** Player HP drains like a timer when touching enemies ("tick-tick-tick") rather than big chunks.
- **Fairness:** More forgiving for brief mistakes, but punishing for staying inside a swarm.
- **Refactor:** `Player` class takes ownership of damage handling and invincibility logic.

## Risks
- **Performance:** High frequency updates/events (10 hits/sec).
- **Visuals:** Flash might be too rapid/epileptic? (We set it to 50ms flicker).

## Dependencies
- `src/game/entities/Enemy.ts`
- `src/game/systems/EnemySpawner.ts`
- `src/game/entities/enemies/EnemyConfig.ts`
- `src/game/systems/CombatManager.ts`
