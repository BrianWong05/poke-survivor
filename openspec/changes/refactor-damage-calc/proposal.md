## Why

The current damage calculation only uses the weapon's fixed damage, ignoring the player's intrinsic stats and evolution multipliers. This refactor is needed to properly scale damage with player progression (levels, evolutions), ensuring that upgrades to the player's power are reflected in combat.

## What Changes

- Update `Weapon` base class to access its owner (`Player`) stats.
- Modify the damage calculation formula to: `(weaponDamage + playerBase) * playerMight`.
- Update `fire()` or projectile spawning methods to pass the calculated `finalDamage`.
- Ensure `Player` exposes `stats.baseDamage` and `might`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `game-core`: Update damage calculation rules to include player stats.

## Impact

- `Weapon.ts`: Base class logic update.
- `Player.ts`: Ensure stats are accessible.
- All weapon subclasses: Indirectly affected by base class change (logic inheritance).
