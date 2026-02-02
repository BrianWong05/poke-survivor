## Why

When a player levels up (especially multiple times at once or just once), the level-up screen incorrectly appears twice for a single level gain. This is caused by a logic error in `MainScene.ts` where the completion callback for the level-up screen re-triggers the sequence without verifying if *another* level is actually pending, assuming the just-processed level constitutes a "new" pending level.

This negatively impacts user experience by forcing players to dismiss or interact with the level-up screen unnecessarily, and breaks the flow of the game.

## What Changes

- **Modify Level-Up Sequence in `MainScene.ts`**:
    - Update `startLevelUpSequence` callback logic.
    - Explicitly separate "committing" the current level-up (applying stats/rewards) from "checking" for subsequent level-ups.
    - Only re-trigger `startLevelUpSequence` if the player has enough XP for *another* level after the current one is processed.

## Capabilities

### Modified Capabilities
- `level-up-selection`: Update the sequence logic to prevent redundant popups for a single level-up event.

## Impact

- **Code**: `src/game/scenes/MainScene.ts`
- **Systems**: Level up orchestration.
