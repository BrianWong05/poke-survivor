/**
 * LevelUpManager - Level Up Selection Logic
 * 
 * Manages the pool of available upgrade/acquisition options
 * including both weapons and passive items.
 */
import Phaser from 'phaser';
import { Player } from '@/game/entities/Player';
import { Item } from '@/game/entities/items/Item';
import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';
import { ITEM_REGISTRY, isPassiveItemClass, createItemInstance } from '@/game/data/ItemRegistry';
import { weapons } from '@/game/entities/weapons';
import type { CharacterContext, CharacterState, WeaponConfig } from '@/game/entities/characters/types';

// Maximum slot limits
const MAX_PASSIVE_SLOTS = 6;
const MAX_WEAPON_SLOTS = 6;
const MAX_WEAPON_LEVEL = 8;

/**
 * Option structure returned by getOptions
 */
export interface LevelUpOption {
  type: 'NEW_ITEM' | 'UPGRADE_ITEM' | 'UPGRADE_WEAPON' | 'NEW_WEAPON';
  // For items
  itemClass?: new () => Item;
  itemInstance?: Item;
  // For weapons
  weaponConfig?: WeaponConfig;
  weaponCurrentLevel?: number;
  weaponId?: string;  // For new weapons
  // Display
  displayName: string;
  displayLevel: string;
  description: string;
  spriteKey?: string;
}

/**
 * LevelUpManager - Static utility class
 */
export class LevelUpManager {
  /**
   * Get available level-up options for the player
   * @param player The player to get options for
   * @param characterState The character state (for weapon info)
   * @param activeWeaponIds List of weapon IDs the player already has
   * @param count Number of options to return (default 4)
   * @returns Array of LevelUpOption
   */
  public static getOptions(
    player: Player, 
    characterState: CharacterState | null,
    count: number = 4,
    activeWeaponIds: string[] = []
  ): LevelUpOption[] {
    const pool: LevelUpOption[] = [];
    
    // 1. Add main weapon upgrade (if below max level)
    if (characterState && characterState.weaponLevel < MAX_WEAPON_LEVEL) {
      const weapon = characterState.activeWeapon;
      const currentLevel = characterState.weaponLevel;
      
      // Check if evolution is pending at next level
      const evolutionLevel = characterState.config?.weapon?.evolutionLevel ?? 5;
      const hasEvolution = characterState.config?.weapon?.evolution;
      const isEvolutionLevel = currentLevel + 1 >= evolutionLevel && hasEvolution && !characterState.isEvolved;
      
      pool.push({
        type: 'UPGRADE_WEAPON',
        weaponConfig: weapon,
        weaponCurrentLevel: currentLevel,
        displayName: weapon.name,
        displayLevel: isEvolutionLevel 
          ? `Lv.${currentLevel} → Evolution!` 
          : `Lv.${currentLevel} → Lv.${currentLevel + 1}`,
        description: isEvolutionLevel 
          ? `Evolves into ${characterState.config?.weapon?.evolution?.name || 'evolved form'}!`
          : weapon.description || 'Upgrade your main weapon',
        spriteKey: weapon.id
      });
    }
    
    // 2. Count current weapon slots (main + debug weapons)
    const currentWeaponCount = 1 + activeWeaponIds.length; // 1 for main weapon
    
    // 3. Add new weapons from registry (if slots available)
    if (currentWeaponCount < MAX_WEAPON_SLOTS) {
      // Get main weapon ID to exclude
      const mainWeaponId = characterState?.activeWeapon?.id || '';
      
      for (const weaponConfig of Object.values(weapons)) {
        // Skip if player already has this weapon
        if (weaponConfig.id === mainWeaponId || activeWeaponIds.includes(weaponConfig.id)) {
          continue;
        }
        
        pool.push({
          type: 'NEW_WEAPON',
          weaponConfig: weaponConfig,
          weaponId: weaponConfig.id,
          weaponCurrentLevel: 0,
          displayName: weaponConfig.name,
          displayLevel: 'New!',
          description: weaponConfig.description || 'Learn a new weapon',
          spriteKey: weaponConfig.id
        });
      }
    }
    
    // 4. Add upgradable existing items
    for (const item of player.items) {
      if (item.level < item.maxLevel) {
        pool.push({
          type: 'UPGRADE_ITEM',
          itemClass: item.constructor as new () => Item,
          itemInstance: item,
          displayName: item.name,
          displayLevel: `Lv.${item.level} → Lv.${item.level + 1}`,
          description: item.description,
          spriteKey: item.id
        });
      }
    }
    
    // 5. Count current slots by type
    const passiveCount = player.items.filter(item => item instanceof PassiveItem).length;
    
    // 6. Add new items from registry
    for (const ItemClass of ITEM_REGISTRY) {
      // Check if player already has this item
      const tempInstance = createItemInstance(ItemClass);
      const alreadyHas = player.items.some(item => item.id === tempInstance.id);
      
      if (!alreadyHas) {
        // Check slot availability by item type
        const isPassive = isPassiveItemClass(ItemClass);
        
        if (isPassive && passiveCount >= MAX_PASSIVE_SLOTS) {
          continue; // No passive slots available
        }
        
        pool.push({
          type: 'NEW_ITEM',
          itemClass: ItemClass,
          itemInstance: undefined,
          displayName: tempInstance.name,
          displayLevel: 'New!',
          description: tempInstance.description,
          spriteKey: tempInstance.id
        });
      }
    }
    
    // 7. Shuffle pool using Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    // 8. Return requested count (or entire pool if smaller)
    return pool.slice(0, Math.min(count, pool.length));
  }
  
  /**
   * Apply the selected option
   * @param scene The current Phaser scene
   * @param player The player to apply the option to
   * @param characterState The character state (for weapon upgrades)
   * @param option The selected LevelUpOption
   * @param onWeaponUpgrade Callback when weapon is upgraded
   * @param onNewWeapon Callback when new weapon is acquired (passes weaponConfig)
   */
  public static selectOption(
    scene: Phaser.Scene, 
    player: Player, 
    characterState: CharacterState | null,
    option: LevelUpOption,
    onWeaponUpgrade?: () => void,
    onNewWeapon?: (config: WeaponConfig) => void
  ): void {
    const ctx: CharacterContext = {
      scene,
      player,
      stats: { maxHP: player.maxHP, speed: 0, baseDamage: 0 },
      currentHP: player.health,
      level: characterState?.level || 1,
      xp: 0
    };
    
    if (option.type === 'UPGRADE_WEAPON' && characterState) {
      // The MainScene handles the actual weapon level increment
      // We just signal that weapon was chosen
      console.log(`[LevelUpManager] Chose weapon upgrade: ${option.displayName}`);
      if (onWeaponUpgrade) {
        onWeaponUpgrade();
      }
    } else if (option.type === 'NEW_WEAPON' && option.weaponConfig) {
      // Acquire a new weapon
      console.log(`[LevelUpManager] Acquired new weapon: ${option.displayName}`);
      if (onNewWeapon) {
        onNewWeapon(option.weaponConfig);
      }
    } else if (option.type === 'UPGRADE_ITEM' && option.itemInstance) {
      // Upgrade existing item
      option.itemInstance.levelUp(ctx);
      console.log(`[LevelUpManager] Upgraded ${option.displayName} to Lv.${option.itemInstance.level}`);
    } else if (option.type === 'NEW_ITEM' && option.itemClass) {
      // Acquire new item
      const newItem = createItemInstance(option.itemClass);
      player.addItem(newItem);
      console.log(`[LevelUpManager] Acquired new item: ${option.displayName}`);
    }
  }
  
  /**
   * Check if player has any available options
   * @param player The player to check
   * @param characterState The character state
   * @returns true if there are options available
   */
  public static hasOptions(player: Player, characterState: CharacterState | null): boolean {
    return this.getOptions(player, characterState, 1).length > 0;
  }
}
