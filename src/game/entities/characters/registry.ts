import type { CharacterConfig } from '@/game/entities/characters/types';

// Character configs will be imported here
import { pikachuConfig } from '@/game/entities/characters/pikachu';
import { charizardConfig } from '@/game/entities/characters/charizard';
import { blastoiseConfig } from '@/game/entities/characters/blastoise';
import { gengarConfig } from '@/game/entities/characters/gengar';
import { lucarioConfig } from '@/game/entities/characters/lucario';
import { snorlaxConfig } from '@/game/entities/characters/snorlax';

/**
 * Registry of all available characters.
 */
export const characterRegistry: Map<string, CharacterConfig> = new Map([
  ['pikachu', pikachuConfig],
  ['charizard', charizardConfig],
  ['blastoise', blastoiseConfig],
  ['gengar', gengarConfig],
  ['lucario', lucarioConfig],
  ['snorlax', snorlaxConfig],
]);

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
