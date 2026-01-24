import type { CharacterConfig } from '@/game/entities/characters/types';
import { shadowTagPassive } from '@/game/entities/passives';
import { lick } from '@/game/entities/weapons';
import { destinyBond } from '@/game/entities/ultimates';

/**
 * Gengar - Wall Hacker / Debuffer Archetype
 * High Speed, Low HP
 */
export const gengarConfig: CharacterConfig = {
  id: 'gengar',
  name: 'gengar',
  displayName: 'Gengar',
  archetype: 'Wall Hacker / Debuffer',
  stats: {
    maxHP: 70,
    speed: 240,
    baseDamage: 12,
  },
  passive: shadowTagPassive,
  weapon: lick,
  ultimate: destinyBond,
  spriteKey: 'gengar',
};
