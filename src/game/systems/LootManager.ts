import Phaser from 'phaser';
import { EnemyTier } from '@/game/entities/enemies/EnemyConfig';
import { LootItemType, LOOT_CONFIG } from '@/game/systems/LootConfig';

/**
 * Manages loot drops from enemies based on their tier.
 */
export class LootManager {
  private xpGems: Phaser.Physics.Arcade.Group;

  constructor(xpGems: Phaser.Physics.Arcade.Group) {
    this.xpGems = xpGems;
  }

  /**
   * Drop loot at the specified position based on enemy tier.
   */
  public drop(x: number, y: number, tier: EnemyTier): void {
    const lootType = this.rollLoot(tier);
    if (!lootType) return; // Should not happen with current logic

    this.spawnItem(x, y, lootType);
  }

  /**
   * Determine which item to drop based on tier probability.
   */
  private rollLoot(tier: EnemyTier): LootItemType {
    const roll = Math.random();

    switch (tier) {
      case EnemyTier.TIER_1:
        // 100% Small
        return LootItemType.EXP_CANDY_S;

      case EnemyTier.TIER_2:
        // 90% Small, 10% Medium
        return roll < 0.9 ? LootItemType.EXP_CANDY_S : LootItemType.EXP_CANDY_M;

      case EnemyTier.TIER_3:
        // 100% Medium
        return LootItemType.EXP_CANDY_M;

      case EnemyTier.TIER_4:
        // 80% Medium, 20% Large
        return roll < 0.8 ? LootItemType.EXP_CANDY_M : LootItemType.EXP_CANDY_L;
      
      case EnemyTier.TIER_5:
        // 100% Large
        return LootItemType.EXP_CANDY_L;

      case EnemyTier.BOSS:
        // 95% Large, 5% Rare
        return roll < 0.95 ? LootItemType.EXP_CANDY_L : LootItemType.RARE_CANDY;

      default:
        // Fallback
        return LootItemType.EXP_CANDY_S;
    }
  }

  /**
   * Spawn the physical item in the game world.
   */
  private spawnItem(x: number, y: number, type: LootItemType): void {
    const config = LOOT_CONFIG[type];
    const textureKey = `candy-${type}`;

    // Get from pool
    const candy = this.xpGems.get(x, y, textureKey) as Phaser.Physics.Arcade.Sprite | null;

    if (candy) {
      // Ensure physics body is enabled and reset (important for pooled items)
      candy.enableBody(true, x, y, true, true);
      candy.setTexture(textureKey);
      
      // Scale visual size
      // S=20, M=24, L=28, Rare=32 (Game scale vs config scale)
      // We can use config.size * 2.5 for game display
      const displaySize = config.size * 2.5; 
      candy.setDisplaySize(displaySize, displaySize);

      // Store data for pickup
      candy.setData('tier', type); // Identifying type
      candy.setData('xpValue', config.xp);
      candy.setData('lootType', type);
    }
  }
}
