# XP Candy Rebalance

## Goal
Rebalance XP Candy values and drop rates to create a "Linear + Step" leveling curve, preventing players from leveling up too quickly (e.g., jumping 5 levels from a single boss).

## Changes
1.  **Update XP Constants** in `src/game/systems/LootConfig.ts`:
    *   `EXP_CANDY_S`: 1 XP (Base)
    *   `EXP_CANDY_M`: 3 XP (Reduced from 10)
    *   `EXP_CANDY_L`: 15 XP (Reduced from 100)
    *   `RARE_CANDY`: 50 XP (Reduced from 1000)

2.  **Adjust Drop Rates** in `src/game/systems/LootManager.ts`:
    *   Tier 2 Enemies: Change `EXP_CANDY_M` drop chance from 20% to 10%.

3.  **Documentation**:
    *   Add a comment explaining the "Linear + Step" leveling curve tuning.

## Verification
1.  **Code Inspection**: Verify constants in `LootConfig.ts` and logic in `LootManager.ts`.
2.  **Manual Playtest**: Kill Tier 2 enemies and Bosses to ensure XP gain feels appropriate (approx 1 level per boss, not 5).
