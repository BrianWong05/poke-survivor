import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import type { ItemStats } from '@/game/entities/items/Item';
import type { CharacterContext } from '@/game/entities/characters/types';

export class HpUp extends PassiveItem {
  id = 'hp-up';
  name = 'HpUp (HP增強劑)';
  description = 'Increases Max Health by 5 per rank.';
  maxLevel = 5;

  getStats(level: number): ItemStats {
    return {
      value: level * 5,
      increaseValue: 5
    };
  }

  onAcquire(ctx: CharacterContext): void {
    const stats = this.getStats(1);
    ctx.player.addMaxHP(stats.value);
    ctx.player.heal(stats.value);
  }

  onUpgrade(ctx: CharacterContext): void {
    const newItemLevel = this.level;
    const oldStats = this.getStats(newItemLevel - 1);
    const newStats = this.getStats(newItemLevel);
    
    // Calculate the difference strictly based on Item Level
    const gain = newStats.value - oldStats.value;
    
    
    ctx.player.addMaxHP(gain);
    ctx.player.heal(gain);
  }

  onRemove(ctx: CharacterContext): void {
    const stats = this.getStats(this.level);
    
    // Revert MaxHP
    ctx.player.addMaxHP(-stats.value);
    
    // Clamp current HP if it exceeds new MaxHP
    if (ctx.player.health > ctx.player.maxHP) {
      ctx.player.health = ctx.player.maxHP;
      ctx.player.scene.events.emit('health-change', ctx.player.health);
    }

    console.log(`[HpUp] Removed. Decreased MaxHP by ${stats.value}.`);
  }
}
