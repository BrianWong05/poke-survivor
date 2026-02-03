import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class HpUp extends PassiveItem {
  id = 'hp_up';
  name = 'HpUp (HP增強劑)';
  description = 'Increases Max Health by 20 per rank.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    return {
      value: level * 5,
      increaseValue: 5
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
