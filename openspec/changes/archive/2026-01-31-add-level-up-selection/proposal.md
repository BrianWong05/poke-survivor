# add-level-up-selection

## Summary
Implement a complete **Level Up Selection System** (Survivor-style) that presents players with randomized upgrade options when they level up. This replaces the current simple "Press ENTER to Continue" level-up flow with an interactive card-based selection UI.

## Motivation
The current level-up system immediately resumes gameplay after showing a basic pause screen. Survivor-style games require:
1. **Upgrade Choices**: Players should choose between upgrading existing items or acquiring new ones
2. **Dynamic Item Pool**: Pool should adapt based on current inventory and slot limits
3. **Game Pause**: Game must be strictly paused during selection to prevent unfair damage

## Scope
- **New Files**: `ItemRegistry.ts`, `LevelUpManager.ts`, `LevelUpScene.ts`
- **Modified Files**: `MainScene.ts` (integration), `UIManager.ts` or removal of `showLevelUpMenu`
- **Existing Patterns**: Follow `weapons/index.ts` Vite glob pattern for registry

## Key Decisions
1. **Phaser Scene vs Overlay**: Using a parallel Phaser Scene (`LevelUpScene`) for the selection UI, rather than DOM overlay, to match existing patterns
2. **Slot Limits**: 6 weapons, 6 passives (aligned with survivor genre conventions)
3. **Pool Logic**: Combines upgradable existing items with acquirable new items

## References
- [MainScene.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/scenes/MainScene.ts) - Level-up trigger logic
- [UIManager.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/systems/UIManager.ts) - Current showLevelUpMenu
- [weapons/index.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/entities/weapons/index.ts) - Vite glob pattern reference
- [Item.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/entities/items/Item.ts) - Item base class
