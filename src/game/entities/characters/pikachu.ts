import type { CharacterConfig } from '@/game/entities/characters/types';
import { staticPassive } from '@/game/entities/passives';
import { ThunderShock } from '@/game/entities/weapons/specific/ThunderShock';
import { gigantamaxThunder } from '@/game/entities/ultimates';

/**
 * Pikachu - Glass Cannon Archetype
 * High Speed, Low HP
 */
export const pikachuConfig: CharacterConfig = {
  id: 'pikachu',
  name: 'pikachu',
  nameKey: 'pokemon_pikachu_name',
  archetypeKey: 'archetype_glass_cannon',
  stats: {
    maxHP: 80,
    speed: 250,
    baseDamage: 15,
  },
  passive: staticPassive,
  weapon: new ThunderShock(),
  ultimate: gigantamaxThunder,
  spriteKey: 'pikachu',
};
