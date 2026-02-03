## Why

Currently, the player's inventory items (active weapons and passive items) are not visible on the HUD during gameplay. The player cannot see what items they have or their levels without checking separate menus or inferring from gameplay visuals. This lack of visibility creates mental load and difficulty in tracking build progress.

## What Changes

*   **New HUD Component:** A visual `InventoryDisplay` that renders item icons.
*   **Two-Row Layout:**
    *   Top Row: Active Weapons.
    *   Bottom Row: Passive Items.
*   **Item Details:**
    *   Icons size: 32x32.
    *   Level Text: Small text overlay showing item level (if > 0).
*   **Integration:** Added to `GameScene` to update automatically on inventory changes.

## Capabilities

### New Capabilities
- `inventory-hud`: Visual display of player's active weapons and passive items on the game HUD.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

*   **Code:** New `src/game/ui/InventoryDisplay.ts`, modification to `src/game/scenes/GameScene.ts`.
*   **Systems:** UI rendering, Inventory state observation.
