import type { CharacterConfig } from '@/game/entities/characters/types';
import { thickFatPassive } from '@/game/entities/passives';
import { bodySlam } from '@/game/entities/weapons';
import { rest } from '@/game/entities/ultimates';

/**
 * Snorlax - AFK Tank Archetype
 * Very Low Speed, Very High HP.
 */
export const snorlaxConfig: CharacterConfig = {
  id: 'snorlax',
  name: 'snorlax',
  displayName: 'Snorlax',
  archetype: 'AFK Tank',
  stats: {
    maxHP: 250,
    speed: 100,
    baseDamage: 25,
  },
  passive: thickFatPassive,
  weapon: bodySlam,
  ultimate: rest,
  spriteKey: 'snorlax',
};
