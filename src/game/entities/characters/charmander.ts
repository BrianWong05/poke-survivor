import type { CharacterConfig } from '@/game/entities/characters/types';
import { blazePassive } from '@/game/entities/passives';
import { flamethrower } from '@/game/entities/weapons';
import { seismicToss } from '@/game/entities/ultimates';

/**
 * Charizard - Area Denial / Tank Archetype
 * Medium Speed, High HP
 */
export const charmanderConfig: CharacterConfig = {
  id: 'charmander',
  name: 'charmander',
  displayName: 'Charmander',
  archetype: 'Area Denial / Tank',
  stats: {
    maxHP: 150,
    speed: 180,
    baseDamage: 20,
  },
  passive: blazePassive,
  weapon: flamethrower,
  ultimate: seismicToss,
  spriteKey: 'charmander',
};
