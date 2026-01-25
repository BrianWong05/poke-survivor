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
 * Tuned for a "Linear + Step" leveling curve where Level 1-5 only requires ~50 XP total.
 */
export const LOOT_CONFIG = {
  [LootItemType.EXP_CANDY_S]: { xp: 1, color: 0x4a9eff, size: 8 },    // Blue, Small (Base Unit)
  [LootItemType.EXP_CANDY_M]: { xp: 3, color: 0x2ecc71, size: 10 },   // Green, Medium (Reduced from 10)
  [LootItemType.EXP_CANDY_L]: { xp: 15, color: 0xe74c3c, size: 12 },  // Red, Large (Reduced from 100)
  [LootItemType.RARE_CANDY]: {  xp: 50, color: 0xf1c40f, size: 16 },  // Gold, Rare (Reduced from 1000)
} as const;
