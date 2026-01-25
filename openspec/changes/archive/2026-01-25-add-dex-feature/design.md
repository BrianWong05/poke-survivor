# Dex Feature Design

## Data Structures

### GameData Registry
We will define interfaces for the Dex entries in `src/config/GameData.ts`.

```typescript
export interface DexEntry {
  id: string; // unique key e.g., 'pikachu', 'rattata'
  name: string;
  description: string;
  spritePath: string; // path to asset or texture key
}

export interface PlayableDexEntry extends DexEntry {
  baseHp: number;
  evolution?: string;
}

export interface EnemyDexEntry extends DexEntry {
  hp: number;
  speed: number;
  dropTier: number;
}

export interface WeaponDexEntry extends DexEntry {
  type: string;
  damage: number;
}
```

### DexManager
The `DexManager` will handle persistence.

```typescript
type DexState = {
  seen: Set<string>;
  unlocked: Set<string>;
};

// Storage format
// key: 'vampire-survivor-dex'
// value: JSON string of { seen: string[], unlocked: string[] }
```

## UI Architecture
- **DexScreen**: Main container.
    - **Tabs**: State-controlled view selector.
    - **Grid**: Renders list of items based on active tab.
    - **Card**: Presentational component.
        - `isUnlocked`: Show full details.
        - `isSeen`: Show greyed out.
        - `else`: Show lock.
    - **Modal**: Overlay for details.

## Integration Points
- **EnemySpawner**: Trigger `markSeen` on `spawn()`.
- **Enemy**: Trigger `markUnlocked` on `die()` / `destroy()`.
- **Player**: Trigger `markUnlocked` for weapons when added to inventory.
