## Why

Testing high-level features such as evolutions (Level 16, 36), limit breaks (Level 20, 40), and stat scaling requires manual grinding, which is inefficient. Developers need a way to instantly manipulate the player's level to verify these mechanics quickly.

## What Changes

- Add a method to `ExperienceManager` (and exposed via `Player` or `MainScene`) to arbitrarily set the player's level.
- Add cheat controls to the Dev Console to:
    - Add 1 Level
    - Add 5 Levels (or Set Level)
- Ensure visual feedback (XP bar update, Level Up text) works correctly when cheating.

## Capabilities

### Modified Capabilities
- `dev-console`: Add "Cheats" section controls for Level manipulation.
- `experience-system`: Expose `setLevel` functionality to bypass normal XP gain logic.

## Impact

- Affects `ExperienceManager.ts`, `Player.ts` (if it proxies the call), and `DevConsole` components.
- No breaking changes to existing gameplay logic.
