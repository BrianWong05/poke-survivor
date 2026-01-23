# Project Context

## Purpose
A 2D "Bullet Heaven" / "Survivor-like" roguelite game prototype inspired by Vampire Survivors. The theme is Pokémon—the player controls a starter Pokémon while endless waves of wild Pokémon swarm them.

## Target Platform
- Primary: Web browser (desktop and mobile)
- Future: Android and iOS via Capacitor

## Tech Stack
- **Build Tool/Framework:** Vite + React + TypeScript
- **Game Engine:** Phaser 3 (WebGL-based canvas rendering)
- **Mobile Controls:** nipplejs (virtual on-screen joystick)
- **Future Mobile:** Capacitor (for Android/iOS deployment)

## Project Conventions

### Code Style
- Follow user_rules: absolute imports with `@/` alias, feature-based structure
- TypeScript strict mode enabled
- Components organized by feature/module
- Environment variables for configuration

### Architecture Patterns
- React manages UI overlay (score, HP, menus)
- Phaser handles all game rendering and logic on a WebGL canvas
- Unidirectional data flow: Phaser emits events → React updates state
- Game loop managed by Phaser; React components are declarative overlays

### Testing Strategy
- Manual browser testing for gameplay mechanics
- Visual verification of rendering and controls
- Performance profiling for entity count stress tests

### Git Workflow
- Feature branches for major changes
- Conventional commits

## Domain Context
- **Bullet Heaven / Survivor-like**: A roguelite subgenre where the player survives waves of enemies, auto-attacks, collects XP, and levels up
- **Key mechanics**: Auto-fire combat, XP economy, enemy waves, collision detection
- Placeholder graphics used to avoid copyrighted Pokémon assets

## Important Constraints
- Must handle 100+ simultaneous moving entities at 60fps
- DOM manipulation is too slow; must use canvas/WebGL via Phaser
- No copyrighted Pokémon images—use programmatic shapes

## External Dependencies
- Phaser 3: https://phaser.io/
- nipplejs: https://github.com/yoannmoinet/nipplejs
