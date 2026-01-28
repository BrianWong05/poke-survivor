# Implement Passive Stats Support

## Summary
Add support for fundamental RPG stats (`regen`, `defense`) to the `Player` entity to enable Passive Items (e.g., Armor, Health Regen upgrades) to function.

## Problem
Currently, the `Player` class only supports `health`, `maxHP`, and `moveSpeedMultiplier`. There is no logic for:
- Damage reduction (Defense)
- Health regeneration (Regen)

This prevents the implementation of passive items that affect these stats.

## Solution
Update `Player.ts` to:
1.  Store `defense` and `regen` stats.
2.  Apply `defense` in `takeDamage()`.
3.  Apply `regen` in `preUpdate()` loop.
4.  Add a `heal()` method for clean health modification.

## Risks
*   **Balance**: High defense could make the player invincible if not capped or balanced (Specification ensures damage >= 1).
*   **Performance**: Minimal risk; simple number checks per frame/second.

## Alternatives Considered
*   **Component System**: Creating a separate `HealthComponent` or `StatsComponent`. Rejected for now to keep the architecture simple and consistent with the current class-based entity structure.
