import type { CharacterConfig } from '@/game/entities/characters/types';
import { staticPassive } from '@/game/entities/passives';
import { thunderShock } from '@/game/entities/weapons';
import { gigantamaxThunder } from '@/game/entities/ultimates';

/**
 * Pikachu - Glass Cannon Archetype
 * High Speed, Low HP
 */
export const pikachuConfig: CharacterConfig = {
  id: 'pikachu',
  name: 'pikachu',
  displayName: 'Pikachu',
  archetype: 'Glass Cannon',
  stats: {
    maxHP: 80,
    speed: 250,
    baseDamage: 15,
  },
  passive: staticPassive,
  weapon: thunderShock,
  ultimate: gigantamaxThunder,
  spriteKey: 'pikachu',
};
