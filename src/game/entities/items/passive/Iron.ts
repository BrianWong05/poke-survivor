import { PassiveItem } from './PassiveItem';
import type { ItemStats } from '../Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class Iron extends PassiveItem {
  id = 'iron';
  name = 'Iron (防禦增強劑)';
  description = 'Reduces incoming damage.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    // Lvl 1: 1 Defense
    // Lvl 2: 1 Def
    // Lvl 3: 2 Def (Increase every 2 levels)
    // Formula: ceil(level / 2) ? 
    // Spec: "+1 Defense every 2 levels" -> 
    // Lvl 1: 1
    // Lvl 2: 1 (+0)
    // Lvl 3: 2 (+1)
    // Lvl 4: 2 (+0)
    // Lvl 5: 3 (+1)
    
    const value = Math.ceil(level / 2); // 1, 1, 2, 2, 3
    
    // Calculate increase from previous level
    const prevValue = level > 1 ? Math.ceil((level - 1) / 2) : 0;
    const increase = value - prevValue;

    return {
      value: value,
      increaseValue: increase
    };
  }

  onAcquire(ctx: CharacterContext): void {
    const stats = this.getStats(1);
    this.applyBuff(ctx, stats.value);
  }

  onUpgrade(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    if (stats.increaseValue > 0) {
      this.applyBuff(ctx, stats.increaseValue);
    }
  }

  private applyBuff(ctx: CharacterContext, amount: number): void {
    ctx.player.defense += amount;
    console.log(`[Iron] Increased Defense by ${amount}. New Defense: ${ctx.player.defense}`);
  }

  onRemove(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    ctx.player.defense -= stats.value;
    console.log(`[Iron] Removed. Decreased Defense by ${stats.value}. New Defense: ${ctx.player.defense}`);
  }
}
