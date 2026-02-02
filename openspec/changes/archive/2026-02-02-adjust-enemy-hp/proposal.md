## Why

The recent refactor of the damage calculation logic has changed how damage is applied to enemies, necessitating a rebalance of enemy durability. Increasing enemy HP will maintain the intended difficulty curve and prevent enemies from being defeated too easily.

## What Changes

*   Significantly increase the `maxHP` for all enemy types (Rattata, Geodude, Zubat) in `EnemyConfig.ts`.
*   Maintain the relative durability ratios between enemy types (e.g., Geodude should still be much tougher than Zubat).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `enemy-stats`: Increase base HP values for all defined enemy types to align with new damage calculation logic.

## Impact

*   `src/game/entities/enemies/EnemyConfig.ts`: Update `maxHP` values in `ENEMY_STATS`.
