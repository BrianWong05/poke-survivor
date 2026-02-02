import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class LoadedDice extends PassiveItem {
  id = 'loaded_dice';
  name = 'Loaded Dice (老千骰子)';
  description = 'Weapon projectile amount +1 per rank.';
  maxLevel = 2;

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
