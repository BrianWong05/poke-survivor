import type { CharacterConfig } from '@/game/entities/characters/types';
import { innerFocusPassive } from '@/game/entities/passives';
import { weapons } from '@/game/entities/weapons';
import { boneRush } from '@/game/entities/ultimates';

/**
 * Lucario - Aura Guardian
 * High Speed, Strong mixed damage
 */
export const lucarioConfig: CharacterConfig = {
  id: 'lucario',
  name: 'Lucario',
  nameKey: 'pokemon_lucario_name',
  archetypeKey: 'archetype_aura_guardian',
  stats: {
    maxHP: 240,
    speed: 250,
    baseDamage: 40,
  },
  passive: innerFocusPassive,
  weapon: weapons.auraSphere,
  ultimate: boneRush,
  spriteKey: 'pokemon_448',
  hidden: true,
};
