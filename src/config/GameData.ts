import { EnemyType, ENEMY_STATS } from '@/game/entities/enemies/EnemyConfig';

export interface DexEntry {
  id: string;
  name: string;
  description: string;
  spritePath: string; // Using texture key for Phaser, or asset path
}

export interface PlayableDexEntry extends DexEntry {
  baseHp: number;
  evolution?: string;
}

export interface EnemyDexEntry extends DexEntry {
  hp: number;
  speed: number;
  dropTier: number;
}

export interface WeaponDexEntry extends DexEntry {
  type: string;
  damage: string; // Using string to describe variable damage (e.g. "Base Damage * 1.5")
}

export const PLAYABLE_DEX: PlayableDexEntry[] = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    description: 'High Speed, Low HP. Glass Cannon.',
    spritePath: 'pikachu',
    baseHp: 80,
    evolution: 'Raichu', // Lore evolution
  },
  {
    id: 'charmander',
    name: 'Charmander',
    description: 'A Fire-type Pokémon.',
    spritePath: 'charmander',
    baseHp: 100, // Placeholder
    evolution: 'Charmeleon',
  },
  {
    id: 'squirtle',
    name: 'Squirtle',
    description: 'A Water-type Pokémon.',
    spritePath: 'squirtle',
    baseHp: 100, // Placeholder
    evolution: 'Wartortle',
  },
];

export const ENEMY_DEX: EnemyDexEntry[] = [
  {
    id: EnemyType.RATTATA,
    name: 'Rattata',
    description: 'A common Normal-type Pokémon. Very fast but weak.',
    spritePath: ENEMY_STATS[EnemyType.RATTATA].textureKey,
    hp: ENEMY_STATS[EnemyType.RATTATA].maxHP,
    speed: ENEMY_STATS[EnemyType.RATTATA].speed,
    dropTier: ENEMY_STATS[EnemyType.RATTATA].tier, // 1
  },
  {
    id: EnemyType.GEODUDE,
    name: 'Geodude',
    description: 'A Rock/Ground-type Pokémon. Slow and sturdy.',
    spritePath: ENEMY_STATS[EnemyType.GEODUDE].textureKey,
    hp: ENEMY_STATS[EnemyType.GEODUDE].maxHP,
    speed: ENEMY_STATS[EnemyType.GEODUDE].speed,
    dropTier: ENEMY_STATS[EnemyType.GEODUDE].tier, // 2
  },
  {
    id: EnemyType.ZUBAT,
    name: 'Zubat',
    description: 'A Poison/Flying-type Pokémon. Fast and annoying.',
    spritePath: ENEMY_STATS[EnemyType.ZUBAT].textureKey,
    hp: ENEMY_STATS[EnemyType.ZUBAT].maxHP,
    speed: ENEMY_STATS[EnemyType.ZUBAT].speed,
    dropTier: ENEMY_STATS[EnemyType.ZUBAT].tier, // 2
  },
];

export const WEAPON_DEX: WeaponDexEntry[] = [
  {
    id: 'thunder-shock',
    name: 'Thunder Shock',
    description: 'Targets nearest enemy with electric projectile',
    spritePath: 'projectile', // Placeholder texture
    type: 'Electric',
    damage: 'Base Damage',
  },
  {
    id: 'volt-tackle',
    name: 'Volt Tackle',
    description: 'Dash forward invincibly, leaving electric trail',
    spritePath: 'pikachu', // Uses player sprite for effect
    type: 'Electric',
    damage: '30 + Base',
  },
  {
    id: 'flamethrower',
    name: 'Flamethrower',
    description: 'Cone of fire in facing direction',
    spritePath: 'projectile',
    type: 'Fire',
    damage: '35 + Base * Multiplier',
  },
  {
    id: 'water-pulse',
    name: 'Water Pulse',
    description: 'Expanding ring pushes enemies back',
    spritePath: 'projectile',
    type: 'Water',
    damage: 'Base Damage',
  },
  {
    id: 'lick',
    name: 'Lick',
    description: 'Short range, ignores walls. Applies Curse debuff',
    spritePath: 'projectile',
    type: 'Ghost',
    damage: 'Base Damage',
  },
  {
    id: 'aura-sphere',
    name: 'Aura Sphere',
    description: 'Homing orb, pierces 2 enemies',
    spritePath: 'projectile',
    type: 'Fighting',
    damage: 'Base Damage',
  },
  {
    id: 'body-slam',
    name: 'Body Slam',
    description: 'Shockwave every 2s based on Max HP',
    spritePath: 'projectile',
    type: 'Normal',
    damage: '10% Max HP',
  },
];
