## 1. Preparation

- [x] 1.1 Update `EnemySpawner.ts` to accept `ExperienceManager` in constructor or via a setter.
- [x] 1.2 Update `MainScene.ts` to provide the `ExperienceManager` instance to `EnemySpawner`.

## 2. Dynamic Scaling Implementation

- [x] 2.1 Refactor `spawnEnemy()` in `EnemySpawner.ts` to retrieve player level from `ExperienceManager`.
- [x] 2.2 Implement HP scaling formula: `BaseHP * (1 + (Level - 1) * 0.1)`.
- [x] 2.3 Implement Damage scaling formula: `BaseDamage * (1 + (Level - 1) * 0.05)`.
- [x] 2.4 Apply rounded scaled stats to the spawned enemy.

## 3. Verification

- [x] 3.1 Verify Level 1 stats (Multiplier = 1.0x).
- [x] 3.2 Verify Level 11 stats (HP Multiplier = 2.0x, Damage Multiplier = 1.5x).
- [x] 3.3 Verify Level 41 stats (HP Multiplier = 5.0x, Damage Multiplier = 3.0x).
