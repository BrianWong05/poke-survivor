import type { CharacterConfig } from '@/game/entities/characters/types';
import { rainDishPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { shellSmash } from '@/game/entities/ultimates';

/**
 * Blastoise - Knockback Tank Archetype
 * Low Speed, High HP
 */
export const squirtleConfig: CharacterConfig = {
  id: 'squirtle',
  name: 'squirtle',
  nameKey: 'pokemon_squirtle_name',
  archetypeKey: 'archetype_knockback_tank',
  stats: {
    maxHP: 180,
    speed: 140,
    baseDamage: 18,
  },
  passive: rainDishPassive,
  weapon: weapons.waterPulse,
  ultimate: shellSmash,
  spriteKey: 'squirtle',
};
