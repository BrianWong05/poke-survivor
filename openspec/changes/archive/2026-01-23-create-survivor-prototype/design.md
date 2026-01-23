# Design: Survivor-like Game Prototype Architecture

## Context
Building a high-performance 2D game that renders 100+ moving entities at 60fps in a web browser. Standard DOM manipulation is too slow; we need WebGL-based canvas rendering via Phaser 3. The game must integrate cleanly with React for UI overlays and support both desktop and mobile inputs.

### Stakeholders
- Players on desktop browsers (keyboard controls)
- Players on mobile browsers (touch joystick controls)
- Future: Capacitor-wrapped Android/iOS apps

### Constraints
- Must achieve 60fps with 100+ simultaneous sprites
- No copyrighted Pokémon assets—use programmatic shapes
- React must not interfere with Phaser's game loop

## Goals / Non-Goals

### Goals
- Establish core gameplay loop (move, auto-attack, collect XP, survive)
- Demonstrate performant rendering of many entities
- Create clean React/Phaser integration pattern
- Support dual input (keyboard + touch joystick)

### Non-Goals
- Full game content (level-ups, abilities, bosses, progression)
- Actual Pokémon sprites or assets
- Audio/sound effects (can be added later)
- Capacitor deployment (future enhancement)
- Persistent save/load system

## Decisions

### Decision 1: React as overlay, Phaser as game engine
**What:** React renders a transparent UI layer (HP bar, score display) on top of the Phaser canvas. Phaser handles all game logic and rendering.

**Why:** 
- Phaser optimizes for WebGL batch rendering; React would cause layout thrashing
- React excels at declarative UI; combining them maximizes each framework's strength
- Event emitter pattern keeps them loosely coupled

**Alternatives considered:**
- Pure Phaser (rejected: harder to build complex UI)
- React-based canvas libraries like react-konva (rejected: not optimized for particle-heavy games)

### Decision 2: Programmatic placeholder graphics
**What:** Generate simple geometric shapes in Phaser's graphics API:
- Player: Blue circle (32px diameter)
- Enemies: Red squares (24px)
- Projectiles: White circles (8px)
- XP gems: Yellow diamonds (12px)

**Why:**
- Avoids copyright issues with actual Pokémon sprites
- Faster iteration; can swap with real sprites later
- Graphics.generateTexture() creates reusable textures

### Decision 3: Entity pooling for performance
**What:** Use Phaser's Group class with pooling for enemies and projectiles.

**Why:**
- Avoids garbage collection spikes from constant create/destroy
- Phaser Groups natively support pooling via `get()` with `createIfNull` and `setActive(false)`
- Critical for smooth 60fps with waves of spawning entities

### Decision 4: nipplejs for mobile controls
**What:** Use nipplejs library for virtual joystick, positioned bottom-left of screen.

**Why:**
- Lightweight (~4KB gzipped), no dependencies
- Returns normalized vector perfect for velocity calculation
- Mobile detection enables joystick only on touch devices

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  ┌────────────────┐  ┌──────────────────────────────────┐   │
│  │   App.tsx      │  │      HUD Component               │   │
│  │   - useState   │◄─┤   - HP bar                       │   │
│  │   - score      │  │   - Score display                │   │
│  │   - hp         │  │   - Transparent overlay          │   │
│  └───────┬────────┘  └──────────────────────────────────┘   │
│          │ props                                             │
│          ▼                                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  GameCanvas Component                   │ │
│  │   useEffect:                                            │ │
│  │     - Create Phaser.Game                                │ │
│  │     - Pass callbacks for HP/Score updates               │ │
│  │     - Cleanup on unmount                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Phaser Game Engine                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    MainScene                            │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │
│  │  │  Player  │ │ Enemies  │ │Projectile│ │ XP Gems  │   │ │
│  │  │  Sprite  │ │  Group   │ │  Group   │ │  Group   │   │ │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │ │
│  │       │            │            │            │          │ │
│  │       ▼            ▼            ▼            ▼          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │              Physics / Collisions                │  │ │
│  │  │   - Arcade Physics for simple AABB collisions    │  │ │
│  │  │   - overlap() for projectile/enemy               │  │ │
│  │  │   - overlap() for player/enemy (damage)          │  │ │
│  │  │   - overlap() for player/XP (collect)            │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow: Phaser → React

```
MainScene (Phaser)                     App.tsx (React)
      │                                      │
      │ this.events.emit('updateScore', n)   │
      │─────────────────────────────────────►│
      │                                      │ setScore(n)
      │ this.events.emit('updateHP', hp)     │
      │─────────────────────────────────────►│
      │                                      │ setHP(hp)
```

## File Structure

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Root component with game state
├── components/
│   ├── GameCanvas/
│   │   └── index.tsx        # Phaser initialization wrapper
│   └── HUD/
│       └── index.tsx        # HP, Score overlay
├── game/
│   ├── config.ts            # Phaser game configuration
│   ├── scenes/
│   │   └── MainScene.ts     # Primary game scene
│   └── entities/
│       ├── Player.ts        # Player entity logic
│       ├── Enemy.ts         # Enemy entity logic
│       └── Projectile.ts    # Projectile entity logic
└── types/
    └── game.d.ts            # TypeScript type definitions
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Phaser's game loop conflicts with React re-renders | Keep Phaser in a ref; never pass game state as props to Phaser |
| Memory leaks from improper cleanup | Explicit game.destroy() in useEffect cleanup |
| Mobile performance varies widely | Use sprite batching, limit particle effects, test on low-end devices |
| Joystick interferes with game touches | Contain joystick to specific zone; prevent event propagation |

## Migration Plan
N/A - This is a greenfield prototype.

## Open Questions
1. **Player speed tuning:** Should player be faster than enemies? (Defaulting to yes, 1.5x speed)
2. **Fire rate scaling:** Should fire rate increase with progression? (Deferred to future enhancement)
3. **Damage numbers:** Display floating damage numbers? (Excluded from prototype scope)
