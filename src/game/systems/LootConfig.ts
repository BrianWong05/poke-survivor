/**
 * Item types that can be dropped by enemies.
 */
/**
 * Item types that can be dropped by enemies.
 */
export const LootItemType = {
  EXP_CANDY_S: 's',
  EXP_CANDY_M: 'm',
  EXP_CANDY_L: 'l',
  RARE_CANDY: 'rare',
} as const;

export type LootItemType = typeof LootItemType[keyof typeof LootItemType];

/**
 * Configuration for loot items (XP values, etc).
 */
export const LOOT_CONFIG = {
  [LootItemType.EXP_CANDY_S]: { xp: 1, color: 0x4a9eff, size: 8 },    // Blue, Small
  [LootItemType.EXP_CANDY_M]: { xp: 10, color: 0x2ecc71, size: 10 },   // Green, Medium
  [LootItemType.EXP_CANDY_L]: { xp: 100, color: 0xe74c3c, size: 12 },  // Red, Large
  [LootItemType.RARE_CANDY]: {  xp: 1000, color: 0xf1c40f, size: 16 }, // Gold, Rare (Instant Level)
} as const;
