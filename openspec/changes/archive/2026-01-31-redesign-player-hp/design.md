# Design: Floating HP Bar

## Architecture

### 1. New Component: `FloatingHpBar`
Located in: `src/game/ui/FloatingHpBar.ts` (New Directory `src/game/ui` required)

A purely visual Phaser component responsible for rendering the health bar.

*   **Dependencies:** `Phaser.Scene`, `Phaser.GameObjects.Graphics`.
*   **State:** Stateless regarding actual health; receives values via `draw()`.
*   **Behavior:**
    *   **Follow:** In `update()`, strictly copies the target's `(x, y)` minus offsets.
    *   **Render:** Draws a black background (alpha 0.8) and a colored foreground (Green).
    *   **Dimensions:** Fixed width (50px), Height (5px), Offset Y (40px).

### 2. Entity Integration: `Player`
The `Player` class owns the `FloatingHpBar` instance.

*   **Lifecycle:**
    *   `constructor`: Initialize `FloatingHpBar`.
    *   `preUpdate`: Call `hpBar.update()` to sync position.
    *   `destroy`: Cleanup `hpBar.destroy()`.
*   **Triggers:**
    *   `takeDamage()`: Call `hpBar.draw()`.
    *   `heal()`: Call `hpBar.draw()`.
    *   `setHealth()`: Call `hpBar.draw()`.
    *   `addMaxHP()`: Call `hpBar.draw()` (handle MaxHP changes).

### 3. Cleanup: `HUD` (React)
The existing React HUD (`src/components/HUD/index.tsx`) must be stripped of HP-related elements to satisfy the "clean HUD" requirement.

*   Remove `hp-container`, `hp-label`, `hp-bar-bg`, `hp-text`.
*   Update `HUDProps` to potentially remove `hp` and `maxHP` if no longer used (or keep them if passed but unused, though removal is cleaner).

## Trade-offs
*   **Visibility:** A floating bar might be obscured by other sprites (enemies, effects). It should have a high depth/z-index.
*   **Precision:** Removing text means players won't know their *exact* HP (e.g., 12/100). This is a design choice for "immersion" over "data".
