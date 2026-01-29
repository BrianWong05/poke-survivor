# Enforce Strict Item Level Scaling for HpUp

## Why
The current `HpUp` implementation uses a base value + increment logic that might be ambiguous or inconsistent. We need to strictly enforce that the HP bonus is calculated solely based on the **Item Level** using the formula `value = itemLevel * 5`.

## What Changes
We will modify `src/game/entities/items/passive/HpUp.ts` to:
1.  Implement `getStats(itemLevel)` using the strict formula.
2.  Update `onAcquire` to use `getStats(1)`.
3.  Update `onLevelUp` to calculate gain based on the difference between `newStats` and `oldStats`.

## Impact
- **Player Stats**: `maxHP` increase will be 5 per level instead of the previous 20.
- **Verification**: Verify via Dev Console that adding levels grants exactly 5 HP.
