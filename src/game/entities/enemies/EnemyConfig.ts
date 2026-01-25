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
  },
  [EnemyType.GEODUDE]: {
    speed: 40,
    maxHP: 50,
    mass: 100,
    textureKey: 'geodude-walk',
    placeholderSize: 28,
    placeholderColor: 0x7f8c8d, // Grey
  },
  [EnemyType.ZUBAT]: {
    speed: 140,
    maxHP: 5,
    textureKey: 'zubat-walk',
    placeholderSize: 20,
    placeholderColor: 0x3498db, // Blue
  },
};

