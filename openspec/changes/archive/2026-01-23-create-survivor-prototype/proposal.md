# Change: Create Survivor-like Game Prototype

## Why
Build a playable prototype of a Pokémon-themed "Bullet Heaven" / "Survivor-like" roguelite game. This establishes the core gameplay loop and technical foundation for a performant web game that can later be deployed to mobile via Capacitor.

## What Changes
- **NEW** Vite + React + TypeScript project scaffolding with Phaser 3 and nipplejs dependencies
- **NEW** Phaser game engine integration within React lifecycle
- **NEW** Main game scene with player, enemies, projectiles, and XP drops (programmatic placeholder graphics)
- **NEW** Dual input system: WASD/Arrow keys for desktop, nipplejs virtual joystick for mobile
- **NEW** Core gameplay loop: movement, enemy spawning, auto-fire combat, collision, XP collection
- **NEW** React UI overlay showing HP and Score, updated via Phaser event emitter
- **NEW** Project structure following user conventions (absolute imports, feature-based organization)

## Impact
- Affected specs:
  - `game-core` (new capability)
  - `player-controls` (new capability)
  - `react-phaser-integration` (new capability)
- Affected code:
  - Project root (new Vite project)
  - `src/` directory structure
  - `src/game/` for Phaser scenes
  - `src/components/` for React UI overlay
  - `vite.config.ts` and `tsconfig.json` for build configuration
