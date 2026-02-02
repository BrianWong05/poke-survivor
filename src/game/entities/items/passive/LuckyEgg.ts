import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class LuckyEgg extends PassiveItem {
  id = 'lucky_egg';
  name = 'Lucky Egg (幸運蛋)';
  description = 'Gain 10% more experience.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    return {
      value: level * 0.1,
      increaseValue: 0.1
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
