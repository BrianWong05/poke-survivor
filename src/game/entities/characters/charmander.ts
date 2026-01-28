import type { CharacterConfig } from '@/game/entities/characters/types';
import { blazePassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { seismicToss } from '@/game/entities/ultimates';

/**
 * Charizard - Area Denial / Tank Archetype
 * Medium Speed, High HP
 */
export const charmanderConfig: CharacterConfig = {
  id: 'charmander',
  name: 'charmander',
  nameKey: 'pokemon_charmander_name',
  archetypeKey: 'archetype_area_denial_tank',
  stats: {
    maxHP: 150,
    speed: 180,
    baseDamage: 20,
  },
  passive: blazePassive,
  weapon: weapons.ember,
  ultimate: seismicToss,
  spriteKey: 'charmander',
};
