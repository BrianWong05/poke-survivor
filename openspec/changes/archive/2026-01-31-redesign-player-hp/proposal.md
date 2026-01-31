# Redesign Player HP Representation

## Summary
Replace the static UI HP bar with a **Floating HP Bar** attached to the player sprite. The goal is to declutter the HUD and provide immediate, localized feedback on player health.

## Problem
The current HP display is part of the static HUD overlay (React). This forces the player to look away from their character to check health, which breaks focus during intense combat. Additionally, the text-based HP numbers add visual noise.

## Solution
1.  **Floating HP Bar:** Implement a Phaser-based HP bar that follows the player.
2.  **Visuals:** Simple green/black bar, no text, positioned above the player's head.
3.  **Cleanup:** Remove the HP section from the existing React HUD.

## Scenarios
- **Taking Damage:** The bar updates immediately to reflect health loss.
- **Healing:** The bar refills visually.
- **Movement:** The bar stays strictly synchronized with the player's position (no lag).
- **Level Up:** If Max HP increases, the bar scales or updates its fill percentage logic accordingly.
