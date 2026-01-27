# Proposal: Implement Aura Sphere Homing Logic

**Change ID:** `implement-aura-sphere`

## Summary
Refactor the "Aura Sphere" weapon to function as a homing missile projectile with a specific 8-level progression system, distinct visual style (blue circular sprite), and "snapping" homing behavior at max level.

## Context
The user has requested a specific implementation for Riolu's innate weapon. Currently, `AuraSphere.ts` exists but likely lacks the sophisticated homing and progression logic requested. Previous specs mentioned an evolution to "Focus Blast" at Level 8, but the new request specifies "TurnRate 999" (Instant snapping) for Level 8 Aura Sphere instead. This proposal prioritizes the new request, effectively keeping it as "Aura Sphere" throughout the progression (or deferring the transformation).

## Goals
1.  **Homing Mechanics:** Implement `turnRate` based steering towards the nearest enemy.
2.  **Progression:** Implement the exact 8-level stat progression provided (Damage, Count, Pierce, TurnRate).
3.  **Visuals:** Ensure projectiles are Blue Circles (`0x00BFFF`) and manage their own rotation/velocity.
4.  **Targeting:** Implement "Find Nearest Enemy" logic for both initial firing and in-flight homing.
5.  **Damage Mechanics:** Implement damage falloff (decay) for secondary targets when piercing.

## Non-Goals
- Implementing "Focus Blast" evolution (superseded by new Lvl 8 requirement for now, unless "Instant Snapping" *is* the Focus Blast mechanic, but the prompt implies Aura Sphere behavior).
- Changes to other weapons.
