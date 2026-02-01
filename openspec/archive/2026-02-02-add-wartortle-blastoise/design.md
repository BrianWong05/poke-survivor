# Design: Wartortle & Blastoise

## Architecture
We will follow the existing pattern of one file per character configuration.

## File Structure
- `src/game/entities/characters/wartortle.ts`: Exports `wartortleConfig`.
- `src/game/entities/characters/blastoise.ts`: Exports `blastoiseConfig`.
- `src/game/entities/characters/registry.ts`: Updates `characterRegistry` to include the new IDs.
- `src/game/entities/characters/squirtle.ts`: Update to link evolution to Wartortle.

## Data Models

### Wartortle
```typescript
{
  id: 'wartortle',
  stats: { maxHP: 320, speed: 160, baseDamage: 30 },
  spriteKey: 'wartortle',
  hidden: true
}
```

### Blastoise
```typescript
{
  id: 'blastoise',
  stats: { maxHP: 550, speed: 190, baseDamage: 55 },
  spriteKey: 'blastoise',
  hidden: true
}
```

## Dependencies
- `rainDishPassive` from `@/game/entities/passives`
- `weapons` from `@/game/entities/weapons`
- `shellSmash` from `@/game/entities/ultimates`
