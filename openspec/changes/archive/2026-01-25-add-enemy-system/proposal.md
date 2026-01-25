# Change: Add Scalable Enemy System

## Why
The current enemy implementation uses bare `Phaser.Physics.Arcade.Sprite` objects with ad-hoc `setData()` calls for HP and behavior flags. This approach doesn't scale for:
- **Multiple enemy types** with distinct stats (speed, HP, mass)
- **Unique AI behaviors** (straight chase, sine-wave patterns, circling)
- **Damage feedback** (hit flashing, death tweens)
- **Performance** with 100+ enemies via proper object pooling

A structured Enemy class hierarchy will enable clean separation of concerns and make it trivial to add new enemy variants.

## What Changes

### New Files
- **`entities/enemies/Enemy.ts`** — Base `Phaser.Physics.Arcade.Sprite` subclass with HP, damage handling, movement AI, and death logic
- **`entities/enemies/Rattata.ts`** — Fast chaff enemy (speed 100, HP 10)
- **`entities/enemies/Geodude.ts`** — Slow tank enemy (speed 40, HP 50, high mass)
- **`entities/enemies/Zubat.ts`** — Rusher with sine-wave evasion AI (speed 140, HP 5)
- **`systems/EnemySpawner.ts`** — Wave-based spawner with object pooling and difficulty ramp

### Modified Files
- **`scenes/MainScene.ts`** — Replace inline `spawnEnemy()` with `EnemySpawner` integration; wire enemy-player collision to damage player

### Removed Files
- None

## Impact

- **Affected specs:** Adds new `enemy-system` capability; modifies `game-core` (Enemy Wave Spawning)
- **Affected code:** `MainScene.ts`, new files under `entities/enemies/` and `systems/`
- **Performance:** Object pooling critical for 100+ simultaneous enemies at 60fps (constraint from `project.md`)

## Dependencies

- `character-system` — Player sprite for movement targeting
- `game-core` — Collision handlers, XP drop system

## Out of Scope

- Boss enemy variants (future proposal)
- Enemy projectile attacks (e.g., shooting enemies)
- Sound effects and VFX polish
