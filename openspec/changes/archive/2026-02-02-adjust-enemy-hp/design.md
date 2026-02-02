## Context

The recent damage calculation refactor removes global I-frames and aims to make damage application more continuous but controlled via cooldowns. This means players can take damage more rapidly, and potentially deal damage differently. To maintain balance, enemy durability needs to be increased. Currently, enemies have very low HP (e.g., Rattata 10, Geodude 50, Zubat 5), which makes them too easy to kill with the new system.

## Goals / Non-Goals

**Goals:**
*   Increase enemy HP to values that provide appropriate challenge levels for each tier.
*   Ensure Geodude remains a "tanky" enemy relative to others.
*   Ensure Zubat remains fragile but annoying.

**Non-Goals:**
*   Changing enemy behavior or attack patterns (other than HP).
*   Refactoring the stats system itself.

## Decisions

### HP Values
We will adjust the base HP values in `ENEMY_STATS` within `EnemyConfig.ts`.

*   **Rattata**: 10 -> 30 (3x increase)
    *   *Rationale*: Needs to survive at least a couple of hits from basic weapons.
*   **Geodude**: 50 -> 150 (3x increase)
    *   *Rationale*: Should require sustained damage or strong attacks to defeat.
*   **Zubat**: 5 -> 15 (3x increase)
    *   *Rationale*: Should still be weak, but not instantly vaporized by incidental damage.

These values are starting points and may need further tuning during playtesting.

## Risks / Trade-offs

*   **Risk**: Enemies become damage sponges, making the game feel slow.
    *   *Mitigation*: Monitor kill times. If too slow, we can adjust player damage output or slightly reduce enemy HP later.
*   **Risk**: Early game becomes too difficult.
    *   *Mitigation*: Ensure the player's starting weapon is effective enough against the new HP values.

## Migration Plan

*   Direct update to `src/game/entities/enemies/EnemyConfig.ts`. No database or complex migration needed.
