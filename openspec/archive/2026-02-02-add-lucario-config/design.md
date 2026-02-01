# Design: Lucario

## Architecture
Follow existing pattern: `lucario.ts` file + registry update.

## File Structure
- `src/game/entities/characters/lucario.ts`: Exports `lucarioConfig`.
- `src/game/entities/characters/riolu.ts`: Update `evolution` field.
- `src/game/entities/characters/registry.ts`: Register `lucario`.

## Data Models

### Lucario
```typescript
{
  id: 'lucario',
  stats: { maxHP: 240, speed: 250, baseDamage: 40 },
  spriteKey: 'lucario', // User specified 'lucario'
  // Reusing Riolu's assets as requested (mapped to actual implementations)
  weapon: weapons.auraSphere,
  ultimate: boneRush,
  passive: innerFocusPassive
}
```

### Riolu Update
```typescript
evolution: {
  targetFormId: 'lucario',
  level: 20
}
```
