import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class AssaultVest extends PassiveItem {
  id = 'assault_vest';
  name = 'Assault Vest (突擊背心)';
  description = 'Increases defense by 1 per rank.';
  maxLevel = 5;
  texture = 'assault_vest';
  tint = 0xFFFFFF;

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
