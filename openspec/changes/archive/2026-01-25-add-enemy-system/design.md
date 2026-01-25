# Design: Scalable Enemy System

## Context

The Poke-Survivor game currently handles enemies as bare `Phaser.Physics.Arcade.Sprite` instances with behavior flags stored via `setData()`. This approach becomes unwieldy as we add:
- Multiple enemy types with different stats
- Unique AI behaviors (chase, evasion, circling)
- Death animations and loot drops
- Performance-critical pooling for 100+ entities

This design introduces a class-based hierarchy for enemies with a dedicated spawner system.

## Goals
- **Extensibility**: Adding a new enemy type should require only one new file
- **Performance**: Object pooling to maintain 60fps with 100+ enemies
- **Separation of Concerns**: Enemy logic (movement, damage, death) encapsulated in classes; spawning logic in a dedicated system
- **Testability**: Clear interfaces for collision and damage events

## Non-Goals
- Networked multiplayer enemy sync
- Procedural enemy generation (stats, abilities)
- Boss enemies (future proposal)

---

## Decisions

### 1. Inheritance vs Composition
**Decision**: Use class inheritance (`Enemy` base class → `Rattata`, `Geodude`, `Zubat` subclasses).

**Rationale**: Phaser's sprite lifecycle (`preUpdate`, `destroy`) integrates cleanly with inheritance. Composition would require manual update loops and adds boilerplate for a simple use case.

**Alternatives Considered**:
- **ECS (Entity Component System)**: Overkill for 3-5 enemy types; adds external dependency
- **Data-driven config**: Good for large variant counts, but we only have 3 initially

---

### 2. Object Pooling Strategy
**Decision**: Use `Phaser.GameObjects.Group` with `classType: Enemy` (or subclass). Subclasses will use separate groups to avoid type confusion.

**Rationale**: Phaser's built-in group pooling (`get()`, `recycleFirstDead()`) is battle-tested and integrates with physics. Separate groups per enemy type simplifies collision logic and spawning.

**Implementation**:
```typescript
// EnemySpawner.ts
this.rattataPool = this.scene.physics.add.group({
  classType: Rattata,
  maxSize: 100,
  runChildUpdate: true, // Enables preUpdate calls
});
```

---

### 3. AI Movement Patterns
**Decision**: Implement AI as overrides of `preUpdate()` in each subclass.

| Enemy   | Movement AI                                     |
|---------|-------------------------------------------------|
| Rattata | `moveToObject(this, target, speed)`             |
| Geodude | `moveToObject + high mass`                      |
| Zubat   | `moveToObject + sine-wave perpendicular offset` |

**Zubat Sine-Wave Formula**:
```typescript
const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
const offset = Math.sin(this.scene.time.now / 200) * 50; // 50px amplitude
const perpAngle = baseAngle + Math.PI / 2;
const offsetX = Math.cos(perpAngle) * offset;
const offsetY = Math.sin(perpAngle) * offset;
const targetX = target.x + offsetX;
const targetY = target.y + offsetY;
this.scene.physics.moveTo(this, targetX, targetY, this.speed);
```

---

### 4. Damage and Death Flow
**Decision**: Emit events rather than direct coupling.

```
takeDamage(amount)
  └─> HP -= amount
  └─> Flash white tint
  └─> if HP <= 0:
        └─> Play fade-out tween
        └─> Emit 'enemy:death' event with (x, y, enemyType)
        └─> Return to pool (setActive(false), setVisible(false))
```

**Rationale**: Decouples enemy class from loot system. MainScene listens to `enemy:death` and calls existing `spawnExpCandy()`.

---

### 5. Spawner Wave Configuration
**Decision**: Time-based difficulty ramp with explicit breakpoints.

```typescript
interface WaveConfig {
  startTime: number;   // seconds since game start
  types: EnemyType[];  // which enemies can spawn
  interval: number;    // milliseconds between spawns
}

const WAVE_CONFIG: WaveConfig[] = [
  { startTime: 0,   types: ['rattata'],           interval: 1000 },
  { startTime: 60,  types: ['rattata', 'zubat'],  interval: 500  },
  { startTime: 120, types: ['rattata', 'zubat', 'geodude'], interval: 200 },
];
```

**Spawn Position**: Random point on a circle of radius 600 centered on the player (outside typical camera view).

```typescript
const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
const radius = 600;
const spawnX = playerX + Math.cos(angle) * radius;
const spawnY = playerY + Math.sin(angle) * radius;
```

---

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Performance regression with many groups | Start with single group, split only if needed; profile early |
| `runChildUpdate: true` overhead | Benchmark; fallback to manual loop in MainScene if slow |
| Subclass proliferation | Max 5-6 types planned; revisit if count exceeds 10 |

---

## File Structure

```
src/game/
├── entities/
│   └── enemies/
│       ├── index.ts          # Barrel export
│       ├── EnemyConfig.ts    # Types and enums
│       ├── Enemy.ts          # Base class
│       ├── Rattata.ts
│       ├── Geodude.ts
│       └── Zubat.ts
└── systems/
    ├── EnemySpawner.ts       # Wave spawner with pooling
    └── ExperienceManager.ts  # (existing)
```

---

## Open Questions
1. **Should enemies drop different loot tiers?** Currently all use uniform `spawnExpCandy()`. Could add per-type multipliers.
2. **Knockback force values for Geodude?** Need playtesting to tune mass.
