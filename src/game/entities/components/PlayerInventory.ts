import type { Item } from '@/game/entities/items/Item';
import type { Player } from '@/game/entities/Player';

export class PlayerInventory {
  private player: Player;
  public items: Item[] = [];

  constructor(player: Player) {
    this.player = player;
  }

  /**
   * Add an item to the inventory.
   * Handles acquiring new items or leveling up existing ones.
   */
  public addItem(item: Item): void {
    const existingItem = this.items.find(i => i.id === item.id);
    
    const ctx = this.getPlayerContext();

    if (existingItem) {
        // Upgrade existing
        existingItem.levelUp(ctx);
    } else {
        // Add new
        this.items.push(item);
        item.levelUp(ctx);
        console.log(`[PlayerInventory] Acquired item: ${item.name}`);
    }
    this.player.scene.events.emit('inventory-updated');
  }

  /**
   * Remove an item from the inventory by ID.
   * Reverts effects via item.onRemove().
   */
  public removeItem(itemId: string): void {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) return;

    const item = this.items[index];
    const ctx = this.getPlayerContext();

    item.onRemove(ctx);
    this.items.splice(index, 1);
    console.log(`[PlayerInventory] Removed item: ${item.name}`);
    this.player.scene.events.emit('inventory-updated');
  }

  /**
   * Set the level of an item.
   * Resets the item and re-applies upgrades to reach the target level.
   */
  public setItemLevel(itemId: string, targetLevel: number): void {
      console.log(`[PlayerInventory] setItemLevel: setting ${itemId} to ${targetLevel}`);
      const item = this.items.find(i => i.id === itemId);
      if (!item) {
          console.warn(`[PlayerInventory] setItemLevel: item ${itemId} not found`);
          return;
      }

      if (targetLevel < 1) targetLevel = 1;
      if (targetLevel > item.maxLevel) targetLevel = item.maxLevel;

      if (targetLevel === item.level) return;

      const ctx = this.getPlayerContext();

      // 1. Remove current effects completely
      item.onRemove(ctx);

      // 2. Reset level
      item.level = 0;

      // 3. Level up to target
      while (item.level < targetLevel) {
          item.levelUp(ctx);
      }
      
      console.log(`[PlayerInventory] Set item ${item.name} to Level ${targetLevel}`);
      this.player.scene.events.emit('inventory-updated');
  }

  /**
   * Get the current level of an item in the inventory.
   * Returns 0 if item is not present.
   */
  public getItemLevel(itemId: string): number {
      const item = this.items.find(i => i.id === itemId);
      return item ? item.level : 0;
  }

  /**
   * Helper to construct the context object required by Items.
   */
  private getPlayerContext() {
      return {
          scene: this.player.scene,
          player: this.player,
          stats: { maxHP: this.player.maxHP, speed: 0, baseDamage: 0 },
          currentHP: this.player.health,
          level: 0, // Placeholder
          xp: 0     // Placeholder
      };
  }

  /**
   * Get all active weapons (Main + Debug/Cheat weapons).
   * returns array of objects with { id, name, level, spriteKey (optional) }
   */
  public get weapons(): { id: string, name: string, level: number, spriteKey?: string }[] {
      const scene = this.player.scene as any; 
      // Safe check for debugSystem
      if (scene.debugSystem && scene.debugSystem.getDebugWeapons) {
          return scene.debugSystem.getDebugWeapons();
      }
      return [];
  }

  /**
   * Get all passive items.
   */
  public get passives(): Item[] {
      return this.items;
  }
}
