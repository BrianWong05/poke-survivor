import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class AmuletCoin extends PassiveItem {
  id = 'amulet_coin';
  name = 'Amulet Coin (護身金幣)';
  description = 'Gain 20% more gold coins per rank.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    return {
      value: level * 0.2,
      increaseValue: 0.2
    };
  }

  onAcquire(ctx: CharacterContext): void {
    ctx.player.recalculateStats?.();
  }

  onUpgrade(ctx: CharacterContext): void {
    ctx.player.recalculateStats?.();
  }

  onRemove(ctx: CharacterContext): void {
    ctx.player.recalculateStats?.();
  }
}
