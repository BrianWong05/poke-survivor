import type { CharacterConfig } from '@/game/entities/characters/types';
import { innerFocusPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { boneRush } from '@/game/entities/ultimates';

/**
 * Lucario - Precision Crit Archetype
 * Medium Speed/HP
 */
export const rioluConfig: CharacterConfig = {
  id: 'riolu',
  name: 'riolu',
  nameKey: 'pokemon_riolu_name',
  archetypeKey: 'archetype_precision_crit',
  stats: {
    maxHP: 100,
    speed: 200,
    baseDamage: 18,
  },
  passive: innerFocusPassive,
  weapon: weapons.auraSphere,
  ultimate: boneRush,
  spriteKey: 'pokemon_447',
};
