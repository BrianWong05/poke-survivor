import type { CharacterConfig } from '@/game/entities/characters/types';

/**
 * Auto-import all character configuration files in this directory.
 * We look for any export ending in 'Config' (e.g., pikachuConfig).
 */
const modules = import.meta.glob('./*.ts', { eager: true });

export const characterRegistry: Map<string, CharacterConfig> = new Map();

for (const path in modules) {
  // Skip registry and types files
  if (path.includes('registry.ts') || path.includes('types.ts')) continue;

  const mod = modules[path] as any;
  for (const key in mod) {
    // We expect character configurations to be exported with a 'Config' suffix
    if (key.endsWith('Config')) {
      const config = mod[key] as CharacterConfig;
      // Ensure it has an ID before adding to registry
      if (config && config.id) {
        characterRegistry.set(config.id, config);
      }
    }
  }
}

/**
 * Get a character configuration by ID.
 * @throws Error if character ID is not found
 */
export function getCharacter(id: string): CharacterConfig {
  const config = characterRegistry.get(id);
  if (!config) {
    throw new Error(`Unknown character: ${id}`);
  }
  return config;
}

/**
 * Get all available character IDs.
 */
export function getCharacterIds(): string[] {
  return Array.from(characterRegistry.keys());
}

/**
 * Get all character configurations.
 */
export function getAllCharacters(): CharacterConfig[] {
  return Array.from(characterRegistry.values());
}
