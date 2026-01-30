# Proposal: Implement Iron (Passive Item)

This change implements the **Iron** passive item which increases the player's Defense (Damage Reduction).

## Why
The current implementation of Iron (if any) or the current stats need to be aligned with the new requirement: "Linear, +1 Defense per Item Level". The user specifically requested this change to match their game design "Defense Enhancement".

## What Changes
- Update `src/game/entities/items/passive/Iron.ts` to implement the required stats and scaling logic.
- Ensure the item is registered in the item registry.
- Verify the scaling logic matches the requirement: +1 Defense per level.

## Risks
- Balance: Defense scaling should be tested to ensure it doesn't make the player invincible too early.
