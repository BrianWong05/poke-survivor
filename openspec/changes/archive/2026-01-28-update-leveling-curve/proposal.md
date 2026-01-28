# Proposal: Update Leveling Curve

## Why
Update the experience leveling formula to a linear curve: `10 + (Level * 12)` to provide a smoother progression.

## Changes
1.  **Refactor `ExperienceManager`**:
    *   Remove the "Step/Bracket" system (`XP_BRACKETS`).
    *   Rename `getRequiredXP` to `getNextLevelXpCap`.
    *   Implement the new linear formula.
    *   Update `gainExperience` (`addXP`) logic to use the new cap.
    *   Update `constructor` to initialize `xpToNextLevel` using the new method.
2.  **Update Call Sites**:
    *   Refactor usages of `getRequiredXP` in `MainScene.ts` (if any), `DevDebugSystem.ts`, and `types.ts`.

## Impact
*   Leveling will be adjusted to the new formula.

## Verification
*   Check level up requirements in Dev Console.
*   Verify `getNextLevelXpCap` returns correct values (22, 34, 130 for Lvl 10).
