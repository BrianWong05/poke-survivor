import type { CharacterConfig } from '@/game/entities/characters/types';

// Character configs will be imported here
import { charmanderConfig } from '@/game/entities/characters/charmander';
import { gastlyConfig } from '@/game/entities/characters/gastly';
import { pikachuConfig } from '@/game/entities/characters/pikachu';
import { raichuConfig } from '@/game/entities/characters/raichu';
import { rioluConfig } from '@/game/entities/characters/riolu';
import { snorlaxConfig } from '@/game/entities/characters/snorlax';
import { squirtleConfig } from '@/game/entities/characters/squirtle';

import { charmeleonConfig } from '@/game/entities/characters/charmeleon';
import { charizardConfig } from '@/game/entities/characters/charizard';

import { haunterConfig } from '@/game/entities/characters/haunter';
import { gengarConfig } from '@/game/entities/characters/gengar';

/**
 * Registry of all available characters.
 */
export const characterRegistry: Map<string, CharacterConfig> = new Map([
  ['charmander', charmanderConfig],
  ['charmeleon', charmeleonConfig],
  ['charizard', charizardConfig],
  ['gastly', gastlyConfig],
  ['haunter', haunterConfig],
  ['gengar', gengarConfig],
  ['pikachu', pikachuConfig],
  ['raichu', raichuConfig],
  ['riolu', rioluConfig],
  ['snorlax', snorlaxConfig],
  ['squirtle', squirtleConfig],
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
