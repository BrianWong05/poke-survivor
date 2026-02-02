## Context

Development requires testing mechanics available only at higher levels (evolutions, limit breaks). Currently, the only way to level up is collecting XP gems, which is slow. We need a shortcut.

## Goals / Non-Goals

**Goals:**
- Enable setting specific player levels or adding levels meaningfully.
- Integrate controls into the existing Dev Console.
- Handle XP bar and stat updates correctly.

**Non-Goals:**
- Automatically selecting upgrades for the skipped levels (User will still have to pick or we just skip the selection if feasible, but MVP is just triggering the level up).

## Decisions

### 1. `ExperienceManager.setLevel` Implementation
We will modify `ExperienceManager` to support:
- `addLevels(count)`: loops `addInstantLevel()`.
- `setLevel(target)`: calcs difference and adds levels.

### 2. Bypass Level Up Screen (Optional/Future)
For this iteration, "Level Up" will trigger the same events as a normal level up. This means if the game is designed to pause and show a selection screen on level up, it will do so. This is acceptable for "Add 1 Level". For "Add 5 Levels", it might be annoying, but acceptable for a first pass.
*Refinement*: We will simply implement the backend logic to increment the level. If the `MainScene` detects the change and triggers the UI, that is expected behavior.

### 3. UI Location
Add a "Cheats" tab or section in the Dev Console (if not exists) or append to "General".
*Current Dev Console has*: Weapons, Items, Cheats. (From screenshot).
So we will add to the **CHEATS** section.

## Risks / Trade-offs

- **Risk**: Adding multiple levels at once might cause event queueing issues if the Level Up screen handles one at a time.
- **Mitigation**: The `MainScene` logic likely checks `experienceManager` state. If we bump level from 1 to 5 instantly, the `MainScene` might only see "Level is 5" and trigger one lookup? Or `ExperienceManager` might return `true` for `processLevelUp`.
- If we manually change `currentLevel` without calling `processLevelUp`, we might bypass the UI trigger (which might be desired!).
- *Approach*: We will modify `ExperienceManager` to allow `forceLevel(level)` which updates the number but maybe optionally suppresses the "level up event" if we want to just test stats/evolution check.
- However, Evolutions often happen ON level up.
- *Decision*: We will invoke the standard level up path `addInstantLevel` so that side effects (stats, evolutions) trigger.

