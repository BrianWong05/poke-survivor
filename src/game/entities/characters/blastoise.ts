import type { CharacterConfig } from '@/game/entities/characters/types';
import { rainDishPassive } from '@/game/entities/passives';
import { waterPulse } from '@/game/entities/weapons';
import { shellSmash } from '@/game/entities/ultimates';

/**
 * Blastoise - Knockback Tank Archetype
 * Low Speed, High HP
 */
export const blastoiseConfig: CharacterConfig = {
  id: 'blastoise',
  name: 'blastoise',
  displayName: 'Blastoise',
  archetype: 'Knockback Tank',
  stats: {
    maxHP: 180,
    speed: 140,
    baseDamage: 18,
  },
  passive: rainDishPassive,
  weapon: waterPulse,
  ultimate: shellSmash,
  spriteKey: 'blastoise',
};
