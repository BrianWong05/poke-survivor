# Design: Dynamic Character Registry

## Refactor Plan

```typescript
const modules = import.meta.glob('./*.ts', { eager: true });
const registry: Map<string, CharacterConfig> = new Map();

for (const path in modules) {
  if (path.includes('registry.ts') || path.includes('types.ts')) continue;
  
  const mod = modules[path] as any;
  for (const key in mod) {
    if (key.endsWith('Config')) {
      const config = mod[key] as CharacterConfig;
      if (config.id) {
        registry.set(config.id, config);
      }
    }
  }
}
```

## Constraints
- All character files in `src/game/entities/characters/` must export a constant ending in `Config`.
- Config objects must have a valid `id` property.
