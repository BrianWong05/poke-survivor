import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class Magnet extends PassiveItem {
  id = 'magnet';
  name = 'Magnet (磁鐵)';
  description = 'Increases pickup range by 30%.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    return {
      value: level * 0.3,
      increaseValue: 0.3
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
