## Context

Currently, weapons in `src/game/entities/weapons/specific/` implement the `WeaponConfig` interface directly and handle damage calculation independently in their `fire()` methods. The calculation only uses the weapon's base damage, ignoring the Player's inherent `baseDamage` and `might` stats (except for some ad-hoc modifiers).

The `Player` class does not openly expose a `stats` object that aligns with the requested formula (`player.stats.baseDamage`).

## Goals / Non-Goals

**Goals:**
- Create a reusable `Weapon` base class that encapsulates common logic (owner reference, damage calculation).
- Implement the comprehensive damage formula: `(WeaponBase + PlayerBase) * PlayerMight`.
- Update `Player.ts` to expose necessary stats.
- Refactor at least one weapon (`AuraSphere`) to demonstrate the new pattern.

**Non-Goals:**
- Refactoring ALL weapons immediately (this can be done incrementally or in a follow-up, though the pattern will be established).
- Changing the specific balance values of all weapons (only the formula changes).

## Decisions

### 1. New Base Class Location
We will create `src/game/entities/weapons/Weapon.ts` instead of `src/game/items/Weapon.ts`.
**Rationale**: Existing weapon entities reside in `entities/weapons`. `entities/items` is for inventory items (`Item.ts`), which are distinct from active weapons in the current architecture.

### 2. Weapon Class Structure
The `Weapon` abstract class will implement `WeaponConfig` and provide:
- `owner`: Reference to the `Player`.
- `getCalculatedDamage(weaponDamage: number): number`: The standardized formula.

### 3. Player Stats Exposure
We will add a `get stats()` accessor to `Player.ts` that returns the underlying `CharacterConfig.stats` (or a composite object) to satisfy `this.owner.stats.baseDamage`.

## Risks / Trade-offs

**Risk**: Existing weapons might break if they rely on ad-hoc logic that conflicts with the new base.
**Mitigation**: We will only refactor `AuraSphere` initially to verify the pattern. Other weapons will continue to work as standalone `WeaponConfig` implementations until migrated.

**Risk**: The formula drastically increases damage if `baseDamage` is high.
**Mitigation**: This is a desired gameplay change (scaling).
