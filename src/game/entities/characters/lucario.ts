import type { CharacterConfig } from '@/game/entities/characters/types';
import { innerFocusPassive } from '@/game/entities/passives';
import { auraSphere } from '@/game/entities/weapons';
import { boneRush } from '@/game/entities/ultimates';

/**
 * Lucario - Precision Crit Archetype
 * Medium Speed/HP
 */
export const lucarioConfig: CharacterConfig = {
  id: 'lucario',
  name: 'lucario',
  displayName: 'Lucario',
  archetype: 'Precision Crit',
  stats: {
    maxHP: 100,
    speed: 200,
    baseDamage: 18,
  },
  passive: innerFocusPassive,
  weapon: auraSphere,
  ultimate: boneRush,
  spriteKey: 'lucario',
};
