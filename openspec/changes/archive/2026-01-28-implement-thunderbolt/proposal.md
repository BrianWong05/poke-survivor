# Implement Thunderbolt Weapon

## Goal
Implement the **Thunderbolt (十萬伏特)** weapon, a "Lightning Ring" archetype weapon that strikes random enemies instantly without aiming.

## User Review Required
> [!NOTE]
> This weapon introduces a new "Random Target Nuke" archetype.

## Proposed Changes
### Game Entities
#### [NEW] [Thunderbolt.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/entities/weapons/specific/Thunderbolt.ts)
- Implements `WeaponConfig` interface.
- Handles random targeting logic.
- Renders `ThunderboltStrike` visuals.

#### [MODIFY] [index.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/entities/weapons/index.ts)
- Register `thunderbolt` instance.

## Verification Plan
### Automated Tests
- None available for Phaser visual entities.

### Manual Verification
- **Equip**: `hero.weapons.add('thunderbolt')` via console.
- **Combat**: Observe bolts striking random enemies.
- **Progression**: Level up to 8 and verify "Thunderstorm" count (10 hits).
- **Fallback**: Verify random ground strikes when no enemies exist.
