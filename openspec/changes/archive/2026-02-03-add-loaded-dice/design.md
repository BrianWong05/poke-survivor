## Context

The "Loaded Dice" passive item allows players to increase the number of projectiles each weapon fires. This requires updates to the player's stat recalculation logic and the core weapon firing routine.

## Goals / Non-Goals

**Goals:**
- Implement a new `amount` stat for the player.
- Allow weapons to fire multiple projectiles based on the `amount` stat.
- Implement a spread pattern for multiple projectiles to prevent overlapping.

**Non-Goals:**
- Changing the fire rate or cooldown (handled by other stats).
- Complex projectile patterns (e.g., circular bursts) for this specific item.

## Decisions

- **Stat Tracking**: Add a public `amount: number = 0` to the `Player` class. This tracks extra projectiles beyond the weapon's base count.
- **Stat Recalculation**: In `Player.recalculateStats()`, check the level of `loaded_dice` and increment `this.amount` by the level (e.g., Level 1 = +1, Level 2 = +2).
- **Firing Logic**: Modify `Weapon.fire()` to use a loop: `totalCount = (baseAmount || 1) + player.amount`.
- **Orbital Weapons**: Update `AquaRing` and `PetalDance` to support `amount`.
  - Recalculate `totalCount` (Base + Amount).
  - Evenly space projectiles around the player (360 / TotalCount).
  - **Infinite Duration Fix**: For Level 8+ orbitals, check if `totalCount` differs from `existing.length`. If so, refresh internal projectiles to reflect the new amount.
- **Spread Pattern**: Apply a 15-degree spread. The projectiles will be distributed around the center `aimAngle`.
  - Offset calculation: `(i - (totalCount - 1) / 2) * 15`
- **Asset Loading**: Download `loaded-dice.png` from PokeAPI and load it in `Preloader.ts`.

## Risks / Trade-offs

- **Performance**: High projectile counts (especially with fast-firing weapons) may impact performance.
  - *Mitigation*: The max level of Loaded Dice is set to 2, limiting the extra projectiles to a manageable number.
- **Visual Clutter**: Too many projectiles can make the screen hard to read.
  - *Mitigation*: The spread logic ensures projectiles are distinct and not just a single thick beam.
