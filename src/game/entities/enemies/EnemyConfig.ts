/**
 * Enemy type definitions and configuration.
 */

/**
 * Enemy type identifiers.
 */
export const EnemyType = {
  RATTATA: 'rattata',
  GEODUDE: 'geodude',
  ZUBAT: 'zubat',
} as const;

export type EnemyType = typeof EnemyType[keyof typeof EnemyType];

/**
 * Loot tier classification for enemies.
 */
export const EnemyTier = {
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3,
  TIER_4: 4,
  TIER_5: 5,
  BOSS: 100,
} as const;

export type EnemyTier = typeof EnemyTier[keyof typeof EnemyTier];

/**
 * Stats configuration for an enemy type.
 */
export interface EnemyStats {
  /** Movement speed in pixels per second */
  speed: number;
  /** Maximum hit points */
  maxHP: number;
  /** Physics body mass (affects knockback resistance) */
  mass?: number;
  /** Texture key for placeholder graphics */
  textureKey: string;
  /** Size of placeholder circle in pixels */
  placeholderSize: number;
  /** Color for placeholder graphics (hex) */
  placeholderColor: number;
  /** Loot tier for this enemy */
  tier: EnemyTier;
}

/**
 * Default stats for each enemy type.
 */
export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  [EnemyType.RATTATA]: {
    speed: 100,
    maxHP: 10,
    textureKey: 'rattata-walk',
    placeholderSize: 24,
    placeholderColor: 0x9b59b6, // Purple
    tier: EnemyTier.TIER_1,
  },
  [EnemyType.GEODUDE]: {
    speed: 40,
    maxHP: 50,
    mass: 100,
    textureKey: 'geodude-walk',
    placeholderSize: 28,
    placeholderColor: 0x7f8c8d, // Grey
    tier: EnemyTier.TIER_2,
  },
  [EnemyType.ZUBAT]: {
    speed: 140,
    maxHP: 5,
    textureKey: 'zubat-walk',
    placeholderSize: 20,
    placeholderColor: 0x3498db, // Blue
    tier: EnemyTier.TIER_2,
  },
};

