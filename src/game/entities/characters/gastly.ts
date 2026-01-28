import type { CharacterConfig } from '@/game/entities/characters/types';
import { shadowTagPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { destinyBond } from '@/game/entities/ultimates';

/**
 * Gengar - Wall Hacker / Debuffer Archetype
 * High Speed, Low HP
 */
export const gastlyConfig: CharacterConfig = {
  id: 'gastly',
  name: 'gastly',
  nameKey: 'pokemon_gastly_name',
  archetypeKey: 'archetype_wall_hacker_debuffer',
  stats: {
    maxHP: 70,
    speed: 240,
    baseDamage: 12,
  },
  passive: shadowTagPassive,
  weapon: weapons.lick,
  ultimate: destinyBond,
  spriteKey: 'gastly',
};
