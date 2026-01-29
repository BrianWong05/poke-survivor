import { PassiveItem } from './PassiveItem';
import type { ItemStats } from '../Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class HpUp extends PassiveItem {
  id = 'hp-up';
  name = 'HpUp (HP增強劑)';
  description = 'Increases Max Health.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    const baseValue = 20;
    const increasePerLevel = 20;
    
    return {
      value: baseValue + (level - 1) * increasePerLevel,
      increaseValue: increasePerLevel
    };
  }

  onAcquire(ctx: CharacterContext): void {
    // Level 1 logic
    const stats = this.getStats(1);
    this.applyBuff(ctx, stats.value);
  }

  onUpgrade(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    // Apply incremental increase
    this.applyBuff(ctx, stats.increaseValue);
  }

  private applyBuff(ctx: CharacterContext, amount: number): void {
    // Increase MaxHP
    ctx.player.maxHP += amount;
    
    // Heal the amount gained so percentage remains similar (or just free heal)
    // Spec says: "Heal the amount we just gained so the bar stays full"
    ctx.player.heal(amount);
    
    console.log(`[HpUp] Increased MaxHP by ${amount}. New MaxHP: ${ctx.player.maxHP}`);
  }
}
