# Implement Body Slam Weapon Redesign

## Goal Description
Redesign Snorlax's **Body Slam** innate weapon to function as a massive intermittent circular AOE shockwave. This replaces mechanics with a new pulse-based system.

## User Review Required
> [!IMPORTANT]
> This redesign completely replaces the current Body Slam logic.

## Proposed Changes
### `src/game/entities/weapons/specific/`
#### [MODIFY] [BodySlam.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/entities/weapons/specific/BodySlam.ts)
*   Redesign `BodySlam` class.
*   Implement `getStats` with Lvl 1-8 progression.
*   Implement `fire` with `Graphics` circle visualization and physics overlap check.

## Verification Plan
### Manual Verification
1.  **Visuals**: Check white/grey circle pulse and screen shake.
2.  **Stats**: Verify Area/Damage/Cooldown progression.
3.  **Physics**: Verify Knockback direction and Stun effect (Lvl 7+).
