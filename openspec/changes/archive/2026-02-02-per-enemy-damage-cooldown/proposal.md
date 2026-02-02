## Why

Currently, the player has a **global invulnerability window** of 100ms after taking any damage. This means if 10 enemies touch the player at the same time, the player only takes 1 hit's worth of damage. This trivializes swarm encounters and removes strategic depth.

Switching to a **Per-Enemy Cooldown** system ensures each enemy tracks its own attack timer, so 10 simultaneous touches = 10x damage.

## What Changes

- **New**: Each enemy tracks its own `lastAttackTime` and can only deal damage if their individual cooldown (500ms) has elapsed.
- **Modified**: The collision handler now checks the enemy's attack cooldown instead of the player's global invulnerability.
- **Modified**: The player's `takeDamage` method no longer sets a global blocking flag; it simply applies damage and triggers a visual hit effect.

## Capabilities

### New Capabilities
- `per-enemy-attack-cooldown`: Enemies track individual attack cooldowns to prevent the same enemy from hitting rapidly, while allowing multiple distinct enemies to hit simultaneously.

### Modified Capabilities
- `damage-logic`: Player invulnerability is removed from damage flow; damage is now gated per-enemy rather than globally.

## Impact

- **Files Modified**:
  - `src/game/entities/enemies/Enemy.ts` - Add `lastAttackTime`, `canAttack()`, `onAttack()`, and reset in `init()`
  - `src/game/systems/CombatManager.ts` - Update `handlePlayerEnemyCollision` to check enemy cooldown
  - `src/game/entities/Player.ts` - Remove global invulnerability blocking in `takeDamage`
