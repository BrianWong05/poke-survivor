# Proposal: Implement HP Scaling for Enemies

## Summary
Implement a difficulty scaling system that increases enemy HP based on the player's level. This ensures that the game remains challenging as the player becomes stronger.

## Motivation
Currently, enemies have static stats regardless of how long the game has progressed or how high the player's level is. This leads to the game becoming too easy in the mid-to-late game. Adding HP scaling will provide a smoother difficulty curve.

## Design
### Formula
`hpMultiplier = 1 + (playerLevel * 0.05)`

### Implementation
1.  **EnemySpawner**: specialized logic to calculate the multiplier and apply it to the enemy's base stats before spawning.
2.  **Enemy Classes** (Rattata, Geodude, Zubat): Update `spawn()` method to accept an optional `stats` override to support externally modified stats (like scaled HP).

## Verification
-   **Manual**: Observe enemy HP values via console logs or debug text at different player levels.
-   **Automated**: Unit test the scaling formula logic (optional if strictly following manual verification for this scope).
