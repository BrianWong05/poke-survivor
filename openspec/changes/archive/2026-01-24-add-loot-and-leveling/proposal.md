# Change: Add Robust Level Up and Loot System

## Why
The current XP collection system is minimal—all enemies drop identical XP gems worth a flat 10 XP. This lacks strategic depth and fails to reward players for surviving longer or defeating stronger enemies. A tiered gem system with diminishing returns at higher levels creates engaging progression curves typical of survivor-like games.

## What Changes

### New Components
- **ExperienceManager class** (`src/game/systems/ExperienceManager.ts`): Pure TypeScript class encapsulating XP/level logic with:
  - Gem tier constants (BLUE=1, GREEN=10, RED=50, CANDY=100 XP)
  - XP curve formula: `Base(5) + (Level * 10)`
  - Diminishing returns multiplier based on level brackets
  - State tracking: `currentLevel`, `currentXP`, `xpToNextLevel`

### Modified Phaser Scene
- **MainScene.ts updates**:
  - Replace inline XP calculation with `ExperienceManager` integration
  - Implement tiered gem drops with weighted probability (80% Blue, 15% Green, 5% Red)
  - Add gem performance optimization: cull furthest gems when count > 300
  - Pause scene on level up and log "Level Up Menu Open" placeholder

### Modified Types
- **Refactor `types.ts`**: Replace existing `addXP` and `xpToLevel` functions with `ExperienceManager` delegation

### UI Enhancement
- **LevelBar component** (`src/components/HUD/LevelBar/index.tsx`): Dedicated component listening to `game-events` for XP updates

## Impact
- **Affected specs**: `game-core` (XP Collection Economy), new spec `experience-system`
- **Affected code**:
  - `src/game/scenes/MainScene.ts` - loot group, drop logic, collection, performance
  - `src/game/entities/characters/types.ts` - XP/level functions
  - `src/game/systems/ExperienceManager.ts` - **NEW**
  - `src/components/HUD/LevelBar/index.tsx` - **NEW**
  - `src/components/HUD/LevelBar/styles.css` - **NEW**
- **Breaking changes**: None—existing XP logic is enhanced, not removed
