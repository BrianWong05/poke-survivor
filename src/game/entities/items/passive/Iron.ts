import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class Iron extends PassiveItem {
  id = 'iron';
  name = 'Iron (防禦增強劑)';
  description = 'Reduces incoming damage by 1 per rank.';
  maxLevel = 5;
  texture = 'item_iron';
  tint = 0xC0C0C0;

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
