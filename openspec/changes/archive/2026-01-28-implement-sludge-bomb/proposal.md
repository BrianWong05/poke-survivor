# Implement Sludge Bomb

**Change ID**: `implement-sludge-bomb`

## Background & Context
The user requested a new "Sludge Bomb" weapon, which functions as a "Lobbed Zone" archetype. This differentiates it from existing projectiles (linear, immediate) and AOE (centered on player). It adds a strategic layer where damage zones linger on the field.

## Goal
Implement the Sludge Bomb weapon with the following characteristics:
1.  **Lobbed Delivery**: Projectiles arc from the player to a random target location.
2.  **Lingering Zones**: Upon landing, creates a damaging zone that hurts enemies over time.
3.  **Upgrade Progression**: Explicit stats for levels 1-8.

## Implementation Plan
1.  **Weapon Config**: Create `SludgeBomb` class in `src/game/entities/weapons/specific/SludgeBomb.ts`.
2.  **Stats**: Implement `getStats` with the 8-level progression.
3.  **Visuals**: Use Tweens for the lob arc and Graphics for the puddle.
4.  **Physics**: Use manual distance checks for the static zone to ensure "clean" overlap logic as requested.

## OpenSpec Delta Map

| Spec ID | Capability | Description |
| :--- | :--- | :--- |
| `sludge-bomb` | `weapons/sludge-bomb` | The core Sludge Bomb weapon logic, visuals, and stats. |
