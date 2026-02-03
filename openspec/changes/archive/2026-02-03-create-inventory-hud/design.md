## Context
The user wants a visual HUD to display active weapons and passive items. Currently, `PlayerInventory` only stores passive items in a generic `items` array, and active weapons are managed separately in `MainScene.characterState.activeWeapon` (and potential debug weapons). There is no centralized way to access "all weapons" or "all passives" from the `Player` object, which `InventoryDisplay` relies on.

## Goals / Non-Goals
**Goals:**
*   Implement `InventoryDisplay` component as requested.
*   Update `PlayerInventory` to expose `weapons` and `passives` getters to abstract the underlying data sources.
*   Integrate `InventoryDisplay` into `MainScene` (aliased as `GameScene`).
*   Ensure item icons and levels are displayed correctly.

**Non-Goals:**
*   Refactoring the entire weapon system to be item-based (too large scope).
*   Adding new assets for weapons/items that don't exist (assuming `id` matches loaded resources or standard fallback).

## Decisions
1.  **PlayerInventory Abstraction**: 
    *   Modify `PlayerInventory.ts` to add `get weapons()` and `get passives()`.
    *   `passives()` will simply return `this.items`.
    *   `weapons()` will access `MainScene` via `this.player.scene` to retrieve the active weapon and any debug weapons. This couples `PlayerInventory` to `MainScene` slightly but avoids a major refactor.

2.  **Sprite Key Resolution**:
    *   `InventoryDisplay` will use `item.id` (or `weapon.id`) as the default `spriteKey` if the property is missing on the object.
    *   We will extend `WeaponConfig` interface to optionally include `spriteKey` to satisfy TypeScript if needed, or simply cast. Given the user's snippet uses `weapon.spriteKey`, we will attempt to support it if added, but fallback to `id`.

3.  **Level Display**:
    *   Passives have `level` property.
    *   Weapons in `CharacterState` use `weaponLevel` (shared). Debug weapons have individual levels. `InventoryDisplay` will handle both.

## Risks / Trade-offs
*   **Risk**: `MainScene` circular dependency or type casting. 
    *   *Mitigation*: Use type assertion `as any` or strictly defined interface for Scene if needed to access `characterState` without importing the full class value (only type).
*   **Risk**: Missing sprites.
    *   *Mitigation*: `InventoryDisplay` is just a consumer; if sprite is missing, Phaser usually renders a placeholder or green box. This acceptable for this task.

## Migration Plan
1.  Update `PlayerInventory.ts`.
2.  Create `InventoryDisplay.ts`.
3.  Update `MainScene.ts`.
