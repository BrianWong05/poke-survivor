# Developer Debug Console for Mechanics Testing

## Goal
Implement a **Developer Debug Console (Dev Menu)** overlay to allow real-time testing of weapons, mechanics, and game states without relying on RNG loot drops. This will be a React-based overlay toggled via the Backtick (`) key.

## Context
Currently, testing specific weapon behaviors (like "Flame Wheel" or "Aqua Ring") requires playing the game and hoping for the correct RNG drop or level-up selection. A debug console will allow instant injection of these weapons and manipulation of player stats (Level Up, Heal, Kill All) to verify mechanics efficiently.

## Proposed Solution

### 1. Global Scene Exposure
*   Modify `MainScene.ts` to expose the current scene instance to the global `window` object as `window.gameScene`.
*   This grants the React-based Dev Console access to internal game systems (Player, ExperienceManager, etc.).

### 2. Debug Methods on MainScene
*   Since the `Player` class does not currently hold system references (like ExperienceManager) or an "Equipment" system for arbitrary weapon addition, we will implement helper methods directly on `MainScene` to support the console:
    *   `debugAddWeapon(weapon: WeaponConfig)`: Instantiates a timer to auto-fire the given weapon, simulating it being "equipped".
    *   `debugLevelUp()`: Adds enough XP to trigger a level up instantly.
    *   `debugHeal()`: Fully heals the player.
    *   `debugKillAll()`: Destroys all active enemies.

### 3. DevConsole React Component
*   **Path:** `src/components/UI/DevConsole.tsx`
*   **Features:**
    *   **Toggle:** Hidden by default, toggled with the Backtick ("`") key.
    *   **UI:** Semi-transparent black panel on the right side.
    *   **Cheats Section:** Buttons for "Level Up", "Full Heal", "Kill All".
    *   **Weapon Manager Section:**
        *   Pre-defined buttons to add "Flame Wheel", "Aqua Ring", "Magical Leaf".
        *   Generic "Add by ID" input (if needed).
*   **Integration:** Placed in `App.tsx` (or `GameOverlay.tsx` if it existed, but `App.tsx` controls the layout).

## Validation
*   **Manual Test:** Run the game, press Backtick, click buttons, observe in-game effects immediately.
