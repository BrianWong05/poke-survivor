## Context

Enemy spawning is handled by `EnemySpawner.ts`. Currently, the system uses a very basic scaling multiplier (5% per level starting from Level 1), which is hardcoded and not aggressive enough to match player power growth.

## Goals / Non-Goals

**Goals:**
- Implement a 10% per level HP scaling formula: `1 + (PlayerLevel - 1) * 0.1`.
- Implement a 5% per level damage scaling formula.
- Ensure the scaling is applied dynamically at the moment of spawning.
- Correctly retrieve the player's level from the game system.

**Non-Goals:**
- Scaling other stats like speed or animation speed.
- Changing the wave interval or enemy types based on player level (this remains time-based).

## Decisions

- **Retrieve Player Level from ExperienceManager**: Instead of relying on a non-existent `player.level` property, the `EnemySpawner` will be updated to receive a reference to the `ExperienceManager` (or retrieve it from the scene if available).
- **formula Implementation**:
  - `difficultyMultiplier = 1 + (level - 1) * 0.1`
  - `damageMultiplier = 1 + (level - 1) * 0.05`
- **Integer Rounding**: Final stats will be rounded to integers using `Math.round` to avoid fractional HP/Damage issues in other systems.

## Risks / Trade-offs

- **[Risk]**: Enemies may become too difficult if the player's level grows faster than their damage output.
  - **Mitigation**: TheScaling is linear, and we can adjust the 0.1 and 0.05 constants easily in the future if balance testing shows it's too punishing.
- **[Trade-off]**: Calculating stats per spawn adds a tiny amount of overhead.
  - **Reason**: This is negligible compared to physics and rendering, and is necessary for dynamic difficulty.
