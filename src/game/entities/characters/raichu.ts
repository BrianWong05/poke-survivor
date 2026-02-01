import type { CharacterConfig } from '@/game/entities/characters/types';
import { staticPassive } from '@/game/entities/passives';
import { ThunderShock } from '@/game/entities/weapons/specific/ThunderShock';
import { gigantamaxThunder } from '@/game/entities/ultimates';

/**
 * Raichu - Evolved Form of Pikachu
 * Higher speed and bulk.
 */
export const raichuConfig: CharacterConfig = {
  id: 'raichu',
  name: 'raichu',
  nameKey: 'pokemon_raichu_name',
  archetypeKey: 'archetype_evolved',
  stats: {
    maxHP: 150,
    speed: 280,
    baseDamage: 25,
    might: 1.5,
    defense: 3,
  },
  passive: staticPassive, // Reuse for now
  weapon: new ThunderShock(), // Reuse for now
  ultimate: gigantamaxThunder, // Reuse for now
  spriteKey: 'raichu',
  hidden: true,
};
