import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class Leftovers extends PassiveItem {
  id = 'leftovers';
  name = 'Leftovers (剩飯)';
  description = 'Restores 1 HP per second per rank.';
  maxLevel = 5;
  texture = 'item_leftovers';
  tint = 0x00FF00;

  getStats(level: number): ItemStats {
    return {
      value: level,
      increaseValue: 1
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
