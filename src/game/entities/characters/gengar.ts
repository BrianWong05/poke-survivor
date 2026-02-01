import type { CharacterConfig } from '@/game/entities/characters/types';
import { shadowTagPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { destinyBond } from '@/game/entities/ultimates';

/**
 * Gengar - Nightmare Weaver
 * Ultimate speedster, hard to hit
 */
export const gengarConfig: CharacterConfig = {
  id: 'gengar',
  name: 'Gengar',
  nameKey: 'pokemon_gengar_name',
  archetypeKey: 'archetype_nightmare_weaver',
  stats: {
    maxHP: 250,
    speed: 310,
    baseDamage: 40,
  },
  passive: shadowTagPassive,
  weapon: weapons.lick,
  ultimate: destinyBond,
  spriteKey: 'gengar',
  hidden: true,
};
