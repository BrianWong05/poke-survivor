import { EnemyType, ENEMY_STATS } from '@/game/entities/enemies/EnemyConfig';

export interface DexEntry {
  id: string;
  nameKey: string;
  descKey: string;
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
    nameKey: 'pokemon_pikachu_name',
    descKey: 'pokemon_pikachu_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    baseHp: 80,
    evolution: 'Raichu', // Lore evolution
  },
  {
    id: 'charmander',
    nameKey: 'pokemon_charmander_name',
    descKey: 'pokemon_charmander_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    baseHp: 100, // Placeholder
    evolution: 'Charmeleon',
  },
  {
    id: 'squirtle',
    nameKey: 'pokemon_squirtle_name',
    descKey: 'pokemon_squirtle_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    baseHp: 100, // Placeholder
    evolution: 'Wartortle',
  },
  {
    id: 'gastly',
    nameKey: 'pokemon_gastly_name',
    descKey: 'pokemon_gastly_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png',
    baseHp: 70,
    evolution: 'Haunter',
  },
  {
    id: 'riolu',
    nameKey: 'pokemon_riolu_name',
    descKey: 'pokemon_riolu_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/447.png',
    baseHp: 100,
    evolution: 'Lucario',
  },
  {
    id: 'snorlax',
    nameKey: 'pokemon_snorlax_name',
    descKey: 'pokemon_snorlax_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
    baseHp: 250,
    evolution: '',
  },
];

export const ENEMY_DEX: EnemyDexEntry[] = [
  {
    id: EnemyType.RATTATA,
    nameKey: 'enemy_rattata_name',
    descKey: 'enemy_rattata_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',
    hp: ENEMY_STATS[EnemyType.RATTATA].maxHP,
    speed: ENEMY_STATS[EnemyType.RATTATA].speed,
    dropTier: ENEMY_STATS[EnemyType.RATTATA].tier, // 1
  },
  {
    id: EnemyType.GEODUDE,
    nameKey: 'enemy_geodude_name',
    descKey: 'enemy_geodude_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',
    hp: ENEMY_STATS[EnemyType.GEODUDE].maxHP,
    speed: ENEMY_STATS[EnemyType.GEODUDE].speed,
    dropTier: ENEMY_STATS[EnemyType.GEODUDE].tier, // 2
  },
  {
    id: EnemyType.ZUBAT,
    nameKey: 'enemy_zubat_name',
    descKey: 'enemy_zubat_desc',
    spritePath: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png',
    hp: ENEMY_STATS[EnemyType.ZUBAT].maxHP,
    speed: ENEMY_STATS[EnemyType.ZUBAT].speed,
    dropTier: ENEMY_STATS[EnemyType.ZUBAT].tier, // 2
  },
];

export const WEAPON_DEX: WeaponDexEntry[] = [
  {
    id: 'thunder-shock',
    nameKey: 'weapon_thundershock_name',
    descKey: 'weapon_thundershock_desc',
    spritePath: 'projectile', // Placeholder texture
    type: 'Electric',
    damage: 'Base Damage',
  },
  {
    id: 'volt-tackle',
    nameKey: 'weapon_volttackle_name',
    descKey: 'weapon_volttackle_desc',
    spritePath: 'pikachu', // Uses player sprite for effect
    type: 'Electric',
    damage: '30 + Base',
  },
  {
    id: 'flamethrower',
    nameKey: 'weapon_flamethrower_name',
    descKey: 'weapon_flamethrower_desc',
    spritePath: 'projectile',
    type: 'Fire',
    damage: '35 + Base * Multiplier',
  },
  {
    id: 'water-pulse',
    nameKey: 'weapon_waterpulse_name',
    descKey: 'weapon_waterpulse_desc',
    spritePath: 'projectile',
    type: 'Water',
    damage: 'Base Damage',
  },
  {
    id: 'lick',
    nameKey: 'weapon_lick_name',
    descKey: 'weapon_lick_desc',
    spritePath: 'projectile',
    type: 'Ghost',
    damage: 'Base Damage',
  },
  {
    id: 'aura-sphere',
    nameKey: 'weapon_aurasphere_name',
    descKey: 'weapon_aurasphere_desc',
    spritePath: 'projectile',
    type: 'Fighting',
    damage: 'Base Damage',
  },
  {
    id: 'body-slam',
    nameKey: 'weapon_bodyslam_name',
    descKey: 'weapon_bodyslam_desc',
    spritePath: 'projectile',
    type: 'Normal',
    damage: '10% Max HP',
  },
];

