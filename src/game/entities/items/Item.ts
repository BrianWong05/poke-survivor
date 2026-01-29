import type { CharacterContext } from '@/game/entities/characters/types';

export interface ItemStats {
  value: number;
  increaseValue: number;
}

export abstract class Item {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  
  public level: number = 0;
  public maxLevel: number = 5; // Default max level

  /**
   * Get the stats provided by this item at a specific level.
   */
  abstract getStats(level: number): ItemStats;

  /**
   * Called when the item is first acquired (Level 1).
   */
  abstract onAcquire(ctx: CharacterContext): void;

  /**
   * Called when the item is upgraded (Level 2+).
   */
  abstract onUpgrade(ctx: CharacterContext): void;

  /**
   * Safe method to level up the item and trigger effects.
   */
  public levelUp(ctx: CharacterContext): void {
    if (this.level >= this.maxLevel) return;

    this.level++;
    
    if (this.level === 1) {
      this.onAcquire(ctx);
    } else {
      this.onUpgrade(ctx);
    }
    
    console.log(`[Item] ${this.name} leveled up to ${this.level}`);
  }
}
