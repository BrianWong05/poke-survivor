# Design: Level Up and Loot System

## Context
The game currently has a basic XP system where all enemies drop identical yellow diamond gems worth 10 XP. The leveling formula uses `100 * level^1.5` which scales too aggressively. The user requests a more nuanced system with:
- Tiered gem drops (visual differentiation by XP value)
- Simpler linear XP curve
- Diminishing returns at high levels
- Performance safeguards for gem count

## Goals
- Implement Exp Candy tiers: S (1 XP), M (10 XP), L (50 XP), XL (100 XP), Rare Candy (200 XP, boss-only)
- Use linear XP curve: `5 + (level * 10)` for predictable progression
- Apply diminishing returns multiplier at level thresholds
- Maintain 60fps with 300+ active gems via culling
- Decouple XP logic into a reusable `ExperienceManager` class

## Non-Goals
- Changing enemy difficulty or spawn rates
- Implementing actual level-up menu (placeholder only)
- Adding gem magnet/attraction mechanics
- Modifying character stat scaling

## Decisions

### 1. ExperienceManager as Pure Class (not Phaser Scene component)
**Decision**: Create `ExperienceManager` as a standalone TypeScript class, not a Phaser plugin.

**Rationale**: 
- Easier to unit test without Phaser dependencies
- Can be used in React context for UI state if needed
- Single source of truth for XP math

**Alternative considered**: Phaser Scene component—rejected because it couples game logic to scene lifecycle.

### 2. Exp Candy Tiers with Programmatic Graphics
**Decision**: Use `this.add.circle()` with different sizes and colors for Exp Candy tiers:
- EXP_CANDY_S: Yellow, 8px (#FFD700)
- EXP_CANDY_M: Orange, 10px (#FFA500)
- EXP_CANDY_L: Red, 12px (#FF4A4A)
- EXP_CANDY_XL: Purple, 14px (#9370DB)
- RARE_CANDY: Cyan square, 16px (#00FFFF) - boss-only

**Rationale**: 
- No asset dependencies
- Size and color differentiation makes value obvious
- Consistent with placeholder graphics pattern

### 3. Diminishing Returns Formula
**Decision**: Apply multipliers in 20-level brackets:
- Level 1-19: 1.0x (full XP)
- Level 20-39: 0.75x
- Level 40-59: 0.50x
- Level 60+: 0.25x

**Rationale**: Soft cap prevents infinite scaling while still rewarding progression.

### 4. Gem Culling Strategy
**Decision**: When gem count exceeds 300, destroy the 50 gems furthest from the player.

**Rationale**: 
- Batch removal is more efficient than checking every frame
- Furthest gems are least likely to be collected
- 300 threshold balances visual density with performance

### 5. Level Up Pause
**Decision**: On level up, call `this.scene.pause()` and log to console. No actual menu yet.

**Rationale**: User explicitly requested placeholder behavior for future implementation.

## Data Structures

### ExpCandyTier Enum
```typescript
export enum ExpCandyTier {
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
  RARE = 'rare',
}

export const EXP_CANDY_VALUES: Record<ExpCandyTier, number> = {
  [ExpCandyTier.S]: 1,
  [ExpCandyTier.M]: 10,
  [ExpCandyTier.L]: 50,
  [ExpCandyTier.XL]: 100,
  [ExpCandyTier.RARE]: 200,
};
```

### ExperienceManager Interface
```typescript
class ExperienceManager {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  
  constructor(startLevel?: number);
  getRequiredXP(level: number): number;
  calculateGain(amount: number, level: number): number;
  addXP(amount: number): boolean; // returns true if leveled up
  reset(): void;
}
```

## Integration Points

### MainScene → ExperienceManager
- Scene holds `ExperienceManager` instance
- `handleXPCollection()` calls `manager.addXP()` instead of inline logic
- On level up return, pause scene and emit event

### MainScene → React (via EventEmitter)
- Emit `'xp-update'` event with `{ current, max, level }` payload
- React `LevelBar` component listens and updates progress bar

### Exp Candy Spawning Flow
```
Regular Enemy Death
    ↓
Roll Probability (70/20/8/2)
    ↓
Determine ExpCandyTier (S/M/L/XL)
    ↓
Spawn Sized Circle at Enemy Position
    ↓
Set candy.data('tier', ExpCandyTier)
    ↓
Add to lootGroup

Boss Enemy Death
    ↓
Spawn RARE_CANDY (cyan square)
    ↓
Add to lootGroup
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Gem culling creates visual pop-in | Cull batch of 50 to minimize frequency |
| Linear XP curve may feel slow late-game | Gem tiers add variance; can tune base/multiplier later |
| Placeholder level menu breaks flow | User acknowledges this is intentional |

## Open Questions
1. ~~Should CANDY gems only drop from boss enemies?~~ **RESOLVED**: Yes, Rare Candy is boss-only.
2. Should candies be attracted to player at close range ("magnet" effect)?

*Magnet effect flagged for future iteration.*
