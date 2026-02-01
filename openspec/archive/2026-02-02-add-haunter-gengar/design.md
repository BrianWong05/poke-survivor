# Design: Haunter & Gengar

## Architecture
We will follow the existing pattern of one file per character configuration.

## File Structure
- `src/game/entities/characters/haunter.ts`: Exports `haunterConfig`.
- `src/game/entities/characters/gengar.ts`: Exports `gengarConfig`.
- `src/game/entities/characters/registry.ts`: Updates `characterRegistry` to include the new IDs.
- `src/game/entities/characters/gastly.ts`: Update to link evolution to Haunter.

## Data Models

### Haunter
```typescript
{
  id: 'haunter',
  stats: { maxHP: 140, speed: 265, baseDamage: 24 },
  spriteKey: 'haunter',
  hidden: true
}
```

### Gengar
```typescript
{
  id: 'gengar',
  stats: { maxHP: 250, speed: 310, baseDamage: 45 },
  spriteKey: 'gengar',
  hidden: true
}
```

## Dependencies
- `shadowTagPassive` from `@/game/entities/passives`
- `weapons` from `@/game/entities/weapons`
- `destinyBond` from `@/game/entities/ultimates`
