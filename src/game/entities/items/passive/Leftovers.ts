import { PassiveItem } from './PassiveItem';
import type { ItemStats } from '../Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class Leftovers extends PassiveItem {
  id = 'leftovers';
  name = 'Leftovers (剩飯)';
  description = 'Restores HP over time.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    // Lvl 1: 1 HP/sec
    // Lvl 2: 1.5 or 2? Spec says "+0.5 or +1". Let's go with +1 for simplicity and impact.
    const baseValue = 1;
    const increasePerLevel = 1;

    return {
      value: baseValue + (level - 1) * increasePerLevel,
      increaseValue: increasePerLevel
    };
  }

  onAcquire(ctx: CharacterContext): void {
    const stats = this.getStats(1);
    this.applyBuff(ctx, stats.value);
  }

  onUpgrade(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    this.applyBuff(ctx, stats.increaseValue);
  }

  private applyBuff(ctx: CharacterContext, amount: number): void {
    ctx.player.regen += amount;
    console.log(`[Leftovers] Increased Regen by ${amount}. New Regen: ${ctx.player.regen}`);
  }
}
