import type { CharacterConfig } from '@/game/entities/characters/types';
import { rainDishPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { shellSmash } from '@/game/entities/ultimates';

/**
 * Blastoise - Siege Fortress
 * High HP, Slow speed, High damage
 */
export const blastoiseConfig: CharacterConfig = {
  id: 'blastoise',
  name: 'Blastoise',
  nameKey: 'pokemon_blastoise_name',
  archetypeKey: 'archetype_siege_fortress',
  stats: {
    maxHP: 550,
    speed: 190,
    baseDamage: 55,
  },
  passive: rainDishPassive,
  weapon: weapons.waterPulse,
  ultimate: shellSmash,
  spriteKey: 'blastoise',
  hidden: true,
};
