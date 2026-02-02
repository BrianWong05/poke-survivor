## Context

The current level-up logic in `MainScene.ts` uses a recursive structure to handle multiple level-ups. When `LevelUpScene` completes, it calls `experienceManager.processLevelUp()`. If this returns `true`, it immediately re-triggers `startLevelUpSequence`.

The issue is that `processLevelUp()` returns `true` if it *successfully processed* a level-up, not necessarily if *another* level is pending. This causes the UI to show the level-up screen again for the level that was just processed (or an empty pending state), leading to a double popup.

## Goals / Non-Goals

**Goals:**
- Ensure the level-up popup shows exactly once per level gained.
- Support multiple level-ups in sequence correctly (e.g. gaining enough XP for 2 levels at once).
- Maintain the current "pause game, show selection, apply upgrade" flow.

**Non-Goals:**
- Refactoring the entire `ExperienceManager` or `LevelUpManager` architecture.
- Changing how XP is calculated or how items are selected.

## Decisions

### Decision: Separate "Commit" from "Check Next"
We will modify the `onComplete` callback in `MainScene.ts`.
Instead of relying on `processLevelUp()`'s return value to decide if we should recurse, we will:
1. Unconditionally call `processLevelUp()` to apply the level we just finished selecting for.
2. Explicitly check `experienceManager` state (`currentXP >= xpToNextLevel`) to see if *another* level is pending.
3. Only recurse if the check is true.

**Rationale:**
This decouples the action of applying the current level modification from the condition of triggering the next one. It is robust and explicit.

## Risks / Trade-offs

**Risk**: `processLevelUp()` logic might change in the future.
**Mitigation**: The explicit check `currentXP >= xpToNextLevel` relies on public properties of `ExperienceManager`, which are stable.

**Risk**: Infinite loop if `currentXP` is not reduced correctly.
**Mitigation**: `processLevelUp` decrements `currentXP`. We assume `processLevelUp` works correctly (and `ExperienceManager` tests/logic verify this).

## Migration Plan
No migration needed. This is a logic fix.
