# Design: Charmeleon & Charizard

## Architecture
We will follow the existing pattern of one file per character configuration in `src/game/entities/characters/`.

## File Structure
- `src/game/entities/characters/charmeleon.ts`: Exports `charmeleonConfig`.
- `src/game/entities/characters/charizard.ts`: Exports `charizardConfig`.
- `src/game/entities/characters/registry.ts`: Updates `characterRegistry` to include the new IDs.
- `src/game/entities/characters/charmander.ts`: Update to link evolution to Charmeleon.

## Data Models

### Charmeleon
```typescript
{
  id: 'charmeleon',
  stats: { maxHP: 280, speed: 210, baseDamage: 35 },
  spriteKey: 'charmeleon'
}
```

### Charizard
```typescript
{
  id: 'charizard',
  stats: { maxHP: 450, speed: 260, baseDamage: 65 },
  spriteKey: 'charizard'
}
```

## Dependencies
- `blazePassive` from `@/game/entities/passives`
- `weapons` from `@/game/entities/weapons`
- `seismicToss` from `@/game/entities/ultimates`
