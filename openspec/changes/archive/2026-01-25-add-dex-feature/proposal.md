# Add Dex (Encyclopedia) Feature

## Goal
Implement a "Dex" (Encyclopedia) feature to list Playable Pokémon, Enemies, and Weapons, tracking what the user has discovered and unlocked.

## Why
To provide a sense of progression and discovery, giving players a way to track their encounters and unlocks across multiple runs.


## User Review Required
- **Data Structure**: Confirm if `spritePath` handling aligns with existing asset loading (Phaser vs React imports).
- **Persistence**: Using `localStorage` for now. Is this sufficient or should we wrap it for future backend sync?

## Proposed Changes
### Config
#### [NEW] [GameData.ts](src/config/GameData.ts)
- Central data registry for `PLAYABLE_DEX`, `ENEMY_DEX`, and `WEAPON_DEX`.

### Systems
#### [NEW] [DexManager.ts](src/systems/DexManager.ts)
- Manages `seen` and `unlocked` states using `localStorage`.

### UI
#### [NEW] [DexScreen](src/components/Menus/DexScreen/index.tsx)
- React component with Tabs (Pokemon, Bestiary, Moves), Grid, and Modal details.

### Integration
#### [MODIFY] [EnemySpawner.ts](src/game/systems/EnemySpawner.ts)
- Call `DexManager.markSeen` when enemies spawn.

#### [MODIFY] [Enemy.ts](src/game/entities/enemies/Enemy.ts)
- Call `DexManager.markUnlocked` when enemies are defeated.

#### [MODIFY] [WeaponManager] (TBD)
- Logic for unlocking weapons (e.g., on acquire or evolution).

## Verification Plan
### Automated Tests
- Unit tests for `DexManager` (mocking localStorage).

### Manual Verification
1.  **Fresh Save**: Clear localStorage and verify Dex is empty (all locks).
2.  **Gameplay**:
    *   Encounter an enemy -> Verify "Seen" (Greyed out) in Dex.
    *   Kill an enemy -> Verify "Unlocked" (Full color + stats) in Dex.
3.  **UI**: Check Tabs switching and Modal opening.
