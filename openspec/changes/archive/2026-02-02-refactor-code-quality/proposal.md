# Code Quality Audit: Refactoring for Import Rules, Atomic Responsibility & File Size

## Summary

This proposal documents a comprehensive audit of the codebase against three quality rules:
1. **No Relative Imports** - All imports must use the `@/` absolute alias
2. **Atomic Responsibility (SRP)** - Each file should handle a single concern
3. **File Length** - Files exceeding 150-200 lines may need decomposition

---

## Violation Report

### Rule 1: Relative Imports (47+ violations)

| File | Line(s) | Violation | Refactoring Suggestion |
|------|---------|-----------|------------------------|
| `src/main.tsx` | 5 | `from './App.tsx'` | Change to `from '@/App'` |
| `src/game/entities/Player.ts` | 1-2 | `from './items/Item'`, `from '../ui/FloatingHpBar'` | Use `@/game/entities/items/Item`, `@/game/ui/FloatingHpBar` |
| `src/game/entities/items/registry.ts` | 1-4 | Multiple `./` and `./passive/` imports | Use absolute `@/game/entities/items/` paths |
| `src/game/entities/items/passive/PassiveItem.ts` | 1 | `from '../Item'` | Use `@/game/entities/items/Item` |
| `src/game/entities/items/passive/HpUp.ts` | 1-2 | `./PassiveItem`, `../Item` | Use absolute `@/game/entities/items/passive/PassiveItem`, `@/game/entities/items/Item` |
| `src/game/entities/items/passive/Leftovers.ts` | 1-2 | Same as HpUp.ts | Same fix |
| `src/game/entities/items/passive/Iron.ts` | 1-2 | Same as HpUp.ts | Same fix |
| `src/game/entities/projectiles/FocusBlastProjectile.ts` | 2 | `from './Explosion'` | Use `@/game/entities/projectiles/Explosion` |
| `src/features/DevConsole/index.tsx` | 2-9 | Multiple `./` imports | Use absolute `@/features/DevConsole/` paths |
| `src/features/DevConsole/useDevConsole.ts` | 4 | `from './types'` | Use `@/features/DevConsole/types` |
| `src/features/DevConsole/components/Header/index.tsx` | 2 | `from '../../styles'` | Use `@/features/DevConsole/styles` |
| `src/features/DevConsole/components/CheatSection/index.tsx` | 2-3 | `../Shared/Section`, `../Shared/Button` | Use absolute paths |
| `src/features/DevConsole/components/MovesRegistrySection/index.tsx` | 2-6 | Multiple relative imports | Use absolute paths |
| `src/features/DevConsole/components/Shared/Button.tsx` | 2-4 | `../../types`, `../../styles`, `../../utils` | Use absolute paths |
| `src/features/DevConsole/components/Shared/Section.tsx` | 2 | `from '../../styles'` | Use absolute paths |
| `src/features/DevConsole/components/ActiveMovesSection/index.tsx` | 2-5 | Multiple relative imports | Use absolute paths |
| `src/features/DevConsole/components/ActiveMovesSection/ActiveMoveRow.tsx` | 2-3 | Relative imports to parent | Use absolute paths |
| `src/features/DevConsole/components/ActiveItemsSection.tsx` | 2-4 | Multiple relative imports | Use absolute paths |
| `src/features/DevConsole/components/ItemsRegistrySection.tsx` | 2-4 | Multiple relative imports | Use absolute paths |

---

### Rule 2: File Length Violations (15 files > 200 lines)

| File | Lines | Severity | Refactoring Suggestion |
|------|-------|----------|------------------------|
| `src/game/scenes/MainScene.ts` | **648** | ⛔ Critical | Extract debug proxy methods to `DevDebugSystem`, extract event handlers to `EventCoordinator` |
| `src/game/entities/enemies/Enemy.ts` | **413** | ⛔ Critical | Extract status effects (paralysis, knockback) to `StatusEffectMixin`, extract animation logic to `EnemyVisuals` |
| `src/game/systems/EnemySpawner.ts` | **350** | 🟠 High | Extract wave definition logic to separate config, consider splitting spawn patterns |
| `src/game/systems/DevDebugSystem.ts` | **342** | 🟠 High | Already specialized; acceptable for a debug utility |
| `src/game/scenes/LevelUpScene.ts` | **338** | 🟠 High | Extract card rendering to `LevelUpCard` component |
| `src/game/systems/CombatManager.ts` | **309** | 🟡 Medium | Consider splitting collision handlers by type |
| `src/game/entities/weapons/specific/ThunderWave.ts` | **294** | 🟡 Medium | Acceptable - complex weapon with visual effects |
| `src/game/entities/Player.ts` | **289** | 🟡 Medium | Extract item management to `PlayerInventory` class |
| `src/game/scenes/Preloader.ts` | **280** | 🟡 Medium | Extract animation definitions to config file |
| `src/game/entities/weapons/specific/SludgeBomb.ts` | **268** | 🟡 Medium | Acceptable - weapon implementation |
| `src/game/entities/ultimates/index.ts` | **258** | 🟡 Medium | Consider splitting ultimate definitions |
| `src/game/entities/weapons/specific/WaterPulse.ts` | **230** | 🔵 Low | Acceptable |
| `src/game/entities/weapons/specific/ThunderShock.ts` | **223** | 🔵 Low | Acceptable |
| `src/game/systems/LevelUpManager.ts` | **220** | 🔵 Low | Acceptable |
| `src/game/systems/UIManager.ts` | **215** | 🔵 Low | Acceptable |

---

### Rule 3: Atomic Responsibility (SRP) Violations

| File | Concerns Mixed | Refactoring Suggestion |
|------|----------------|------------------------|
| `src/game/scenes/MainScene.ts` | Scene orchestration + Debug proxies + XP collection + Weapon firing + Event handling | 1. Move all `debug*` methods to be pure proxies (single line calls) or remove entirely<br>2. Extract `handleXPCollection` logic to `ExperienceManager`<br>3. Extract weapon timer management to a dedicated `WeaponScheduler` |
| `src/game/entities/Player.ts` | Movement/Physics + HP management + Item inventory + Damage mitigation + Regeneration | 1. Extract item management (`addItem`, `removeItem`, `setItemLevel`) to `PlayerInventory`<br>2. Consider `PlayerStats` for HP/regen logic |
| `src/game/entities/enemies/Enemy.ts` | AI Movement + Visual rendering + Status effects (paralysis, knockback) + Death handling | 1. Extract `paralyze`, `cureParalysis`, `applyKnockback` to `StatusEffectController`<br>2. Extract `updateVisuals`, `flashHit`, `showCritText` to `EnemyRenderer` |
| `src/game/scenes/LevelUpScene.ts` | UI scene management + Card rendering + Option generation + Button creation | Extract `createCard` and `createButton` to reusable UI components |
| `src/features/DevConsole/useDevConsole.ts` | Hook state + Event listeners + Data transformation + Keyboard handling | Consider splitting into smaller hooks: `useDevConsoleState`, `useDevConsoleEvents`, `useDevConsoleKeyboard` |

---

## Prioritized Action Items

### Phase 1: Quick Wins (Import Fixes)
- [ ] Fix all 47+ relative imports to use `@/` alias
- **Effort:** Low | **Impact:** High (consistency)

### Phase 2: Critical Decomposition
- [ ] Refactor `MainScene.ts` (648 → ~300 lines)
- [ ] Refactor `Enemy.ts` (413 → ~200 lines)
- **Effort:** High | **Impact:** High (maintainability)

### Phase 3: Moderate Refactoring
- [ ] Extract `PlayerInventory` from `Player.ts`
- [ ] Create reusable `LevelUpCard` component
- **Effort:** Medium | **Impact:** Medium

---

## User Review Required

> [!IMPORTANT]
> This audit identifies **potential** violations. Some files (e.g., weapon implementations) may justifiably exceed 200 lines due to complex visual effects or self-contained logic.

Please confirm:
1. Which violations should be prioritized for fixing?
2. Are there any files you'd like to exclude from the refactoring scope?
3. Should we create separate OpenSpec changes for each phase, or handle as a single large refactor?
