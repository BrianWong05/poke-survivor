import type { CharacterConfig } from '@/game/entities/characters/types';
import { blazePassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { seismicToss } from '@/game/entities/ultimates';

/**
 * Charizard - Mobile Artillery
 * Final form of Charmander
 */
export const charizardConfig: CharacterConfig = {
  id: 'charizard',
  name: 'Charizard',
  nameKey: 'pokemon_charizard_name',
  archetypeKey: 'archetype_mobile_artillery',
  stats: {
    maxHP: 450,
    speed: 260,
    baseDamage: 65,
  },
  passive: blazePassive,
  weapon: weapons.ember,
  ultimate: seismicToss,
  spriteKey: 'charizard',
  hidden: true,
};
