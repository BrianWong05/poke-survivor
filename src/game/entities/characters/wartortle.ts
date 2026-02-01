import type { CharacterConfig } from '@/game/entities/characters/types';
import { rainDishPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { shellSmash } from '@/game/entities/ultimates';

/**
 * Wartortle - Shell Guardian
 * Defensively oriented, slight mobility bump
 */
export const wartortleConfig: CharacterConfig = {
  id: 'wartortle',
  name: 'Wartortle',
  nameKey: 'pokemon_wartortle_name',
  archetypeKey: 'archetype_shell_guardian',
  stats: {
    maxHP: 320,
    speed: 160,
    baseDamage: 30,
  },
  passive: rainDishPassive,
  weapon: weapons.waterPulse,
  ultimate: shellSmash,
  spriteKey: 'wartortle',
  hidden: true,
  evolution: {
    targetFormId: 'blastoise',
    level: 40,
  },
};
