import type { CharacterConfig } from '@/game/entities/characters/types';
import { shadowTagPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { destinyBond } from '@/game/entities/ultimates';

/**
 * Haunter - Shadow Stalker
 * High mobility, fragile
 */
export const haunterConfig: CharacterConfig = {
  id: 'haunter',
  name: 'Haunter',
  nameKey: 'pokemon_haunter_name',
  archetypeKey: 'archetype_shadow_stalker',
  stats: {
    maxHP: 140,
    speed: 265,
    baseDamage: 24,
  },
  passive: shadowTagPassive,
  weapon: weapons.lick,
  ultimate: destinyBond,
  spriteKey: 'haunter',
  hidden: true,
  evolution: {
    targetFormId: 'gengar',
    level: 40,
  },
};
