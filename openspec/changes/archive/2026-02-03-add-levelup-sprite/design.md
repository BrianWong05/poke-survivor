## Context

The `LevelUpScene` displays upgrade options using cards. Currently, these cards use a text-based placeholder (first letter of the item name in a circle) for the icon. This design aims to replace those placeholders with actual sprites loaded in `Preloader.ts`.

## Goals / Non-Goals

**Goals:**
- Add `spriteKey` to `LevelUpOption` interface.
- Populate `spriteKey` in `LevelUpManager.getOptions()` for both passive items and weapons.
- Render the Phaser sprite in `LevelUpScene.createCard()`.
- Handle scaling to ensure sprites fit within the icon area.

**Non-Goals:**
- Creating new sprite assets (assuming they are already loaded or handled by the asset pipeline).
- Changing the layout of the level-up cards beyond the icon replacement.

## Decisions

1. **Interface Expansion**:
   Add `spriteKey?: string` to `LevelUpOption`. This decouples the display logic from the item/weapon underlying objects.

2. **Manager Logic**:
   - For `PassiveItem`: Instance already has a `spriteKey` (e.g. `muscle_band`).
   - For `WeaponConfig`: Currently lacks a explicit `spriteKey`. We will use `weaponConfig.id` (normalized to snake_case if necessary) as the default sprite key, or update `WeaponConfig` to include it if consistency is required.
   - For Evolution upgrades: Use the sprite of the evolved form.

3. **Rendering Implementation**:
   - In `LevelUpScene.ts`, replace the `iconLetter` text and `iconBg` circle with a `Phaser.GameObjects.Sprite`.
   - Scale the sprite to fit a ~64x64 area (the circle placeholder is currently radius 35, meaning diameter 70).
   - If a sprite is missing, fallback to the current circle+letter placeholder to prevent UI breakage.

## Risks / Trade-offs

- **Risk**: Missing texture keys for some weapons (e.g. if the `id` doesn't match the preloaded key).
- **Mitigation**: Implement a check `this.textures.exists(spriteKey)`. If false, use the fallback placeholder.
- **Trade-off**: Adding `spriteKey` to `LevelUpOption` adds a small amount of data to the object, but it's minimal compared to the benefit of decoupled rendering.
