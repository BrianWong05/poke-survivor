import { PassiveItem } from './PassiveItem';
import type { ItemStats } from '../Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class Leftovers extends PassiveItem {
  id = 'leftovers';
  name = 'Leftovers (剩飯)';
  description = 'Restores 0.5 HP per second per rank.';
  maxLevel = 5;
  texture = 'item_leftovers';
  tint = 0x00FF00;

  getStats(level: number): ItemStats {
    // Linear scaling: +0.5 HP/sec per level
    // Lvl 1: 0.5 HP
    // Lvl 2: 1.0 HP
    // ...
    // Lvl 5: 2.5 HP
    return {
      value: level * 0.5,
      increaseValue: 0.5
    };
  }

  onAcquire(ctx: CharacterContext): void {
    const stats = this.getStats(1);
    ctx.player.regen += stats.value;
    console.log(`[Leftovers] Acquired. Regen +${stats.value}. Total: ${ctx.player.regen}`);
  }

  onUpgrade(ctx: CharacterContext): void {
    const oldStats = this.getStats(this.level - 1);
    const newStats = this.getStats(this.level);
    const gain = newStats.value - oldStats.value;
    
    ctx.player.regen += gain;
    console.log(`[Leftovers] Upgraded to Lvl ${this.level}. Regen +${gain}. Total: ${ctx.player.regen}`);
  }

  onRemove(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    ctx.player.regen -= stats.value;
    console.log(`[Leftovers] Removed. Regen -${stats.value}. Total: ${ctx.player.regen}`);
  }
}
