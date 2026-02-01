import type { CharacterConfig } from '@/game/entities/characters/types';
import { blazePassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { seismicToss } from '@/game/entities/ultimates';

/**
 * Charmeleon - Pyro Bruiser
 * Evolved form of Charmander
 */
export const charmeleonConfig: CharacterConfig = {
  id: 'charmeleon',
  name: 'Charmeleon',
  nameKey: 'pokemon_charmeleon_name',
  archetypeKey: 'archetype_pyro_bruiser',
  stats: {
    maxHP: 280,
    speed: 210,
    baseDamage: 35,
  },
  passive: blazePassive,
  weapon: weapons.ember,
  ultimate: seismicToss,
  spriteKey: 'charmeleon',
  hidden: true,
  evolution: {
    targetFormId: 'charizard',
    level: 40,
  },
};
