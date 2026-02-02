## Why

Currently, enemy difficulty remains static or scales very slowly, making the game trivial as the player gains levels and better equipment. Dynamic enemy scaling ensures that the game remains challenging and engaging throughout the play session by keeping enemy power proportional to the player's level.

## What Changes

- Refactor `EnemySpawner.ts` to calculate enemy HP and damage at the moment of spawning.
- Implement a scaling formula for HP: `BaseHP * (1 + ((PlayerLevel - 1) * 0.1))`.
- Implement a scaling formula for Damage: `BaseDamage * (1 + ((PlayerLevel - 1) * 0.05))`.
- Update the spawning logic to retrieve base stats and apply the scaling multiplier based on the player's current level.

## Capabilities

### New Capabilities
- `enemy-scaling`: Defines the rules and formulas for how enemy difficulty scales with player progress.

### Modified Capabilities
- `enemy-stats`: Updates how base stats are applied to spawned enemies.
- `enemy-system`: Modifies the spawning process to include dynamic stat calculation.

## Impact

- `EnemySpawner.ts`: Core logic for spawning and scaling will be updated.
- `Enemy.ts`: Will need to ensure it can receive and apply these scaled stats correctly.
- Game Balance: The game will become significantly more difficult at higher player levels compared to the current implementation.
