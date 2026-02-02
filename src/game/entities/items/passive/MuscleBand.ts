import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class MuscleBand extends PassiveItem {
  id = 'muscle-band';
  name = 'Muscle Band (力量頭帶)';
  description = 'Increases Damage output by 10% per rank.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    return {
      value: level * 0.1,
      increaseValue: 0.1
    };
  }

  onAcquire(ctx: CharacterContext): void {
    // Logic moved to Player.recalculateStats()
    ctx.player.recalculateStats?.();
  }

  onUpgrade(ctx: CharacterContext): void {
    // Logic moved to Player.recalculateStats()
    ctx.player.recalculateStats?.();
  }

  onRemove(ctx: CharacterContext): void {
    // Logic moved to Player.recalculateStats()
    ctx.player.recalculateStats?.();
  }
}
