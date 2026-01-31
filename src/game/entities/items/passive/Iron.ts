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
    // Linear scaling: +1 Defense per level
    // Lvl 1: 1 Defense
    // Lvl 2: 2 Defense
    // ...
    // Lvl 5: 5 Defense
    return {
      value: level,
      increaseValue: 1
    };
  }

  onAcquire(ctx: CharacterContext): void {
    const stats = this.getStats(1);
    ctx.player.defense += stats.value;
    console.log(`[Iron] Acquired. Defense +${stats.value}. Total: ${ctx.player.defense}`);
  }

  onUpgrade(ctx: CharacterContext): void {
    const oldStats = this.getStats(this.level - 1);
    const newStats = this.getStats(this.level);
    const gain = newStats.value - oldStats.value;
    
    ctx.player.defense += gain;
    console.log(`[Iron] Upgraded to Lvl ${this.level}. Defense +${gain}. Total: ${ctx.player.defense}`);
  }

  onRemove(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    ctx.player.defense -= stats.value;
    console.log(`[Iron] Removed. Defense -${stats.value}. Total: ${ctx.player.defense}`);
  }
}
