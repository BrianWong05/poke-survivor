# Implement "Leftovers" Passive Item

**Goal:** Add a new passive item called "Leftovers (剩飯)" that provides permanent Health Regeneration (HP/sec) to the player.

## Summary

The Leftovers item will grant the player health regeneration based on its level. It scales linearly by +0.5 HP/sec per level.

## Stats & Logic

*   **Name**: Leftovers (剩飯)
*   **Description**: Restores 0.5 HP per second per rank.
*   **Scaling**: `value = itemLevel * 0.5`
*   **Effect**:
    *   **Acquire**: Adds `0.5` to player regen.
    *   **Level Up**: Adds `0.5` to player regen (difference between new and old stats).
*   **Visuals**:
    *   **Texture**: `'item_leftovers'`
    *   **Tint**: `0x00FF00` (Green)
