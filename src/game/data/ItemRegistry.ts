/**
 * ItemRegistry - Dynamic Item Class Loader
 * 
 * Uses Vite's import.meta.glob to automatically discover and register
 * all Item classes from the passive items directory.
 */
import { Item } from '@/game/entities/items/Item';
import { PassiveItem } from '@/game/entities/items/passive/PassiveItem';

// Eager load all passive item modules
const passiveModules = import.meta.glob('../entities/items/passive/*.ts', { eager: true });

// Store item class constructors (not instances)
type ItemClass = new () => Item;

export const ITEM_REGISTRY: ItemClass[] = [];

// Extract valid Item classes from modules
for (const path in passiveModules) {
  // Skip the base PassiveItem class file
  if (path.includes('PassiveItem.ts')) continue;
  
  const mod = passiveModules[path] as Record<string, unknown>;
  
  for (const exportName in mod) {
    const Exported = mod[exportName];
    
    // Check if it's a class (constructor function)
    if (typeof Exported === 'function' && Exported.prototype) {
      try {
        // Instantiate to verify it's a valid Item
        const instance = new (Exported as ItemClass)();
        
        // Duck-type check: must have id, name, and levelUp method
        if (
          instance.id &&
          instance.name &&
          typeof instance.levelUp === 'function' &&
          instance instanceof Item
        ) {
          ITEM_REGISTRY.push(Exported as ItemClass);
          console.log(`[ItemRegistry] Registered: ${instance.name} (${instance.id})`);
        }
      } catch {
        // Ignore non-constructible exports (interfaces, types, etc.)
      }
    }
  }
}

console.log(`[ItemRegistry] Total items registered: ${ITEM_REGISTRY.length}`);

/**
 * Helper to check if an item class is a PassiveItem
 */
export function isPassiveItemClass(ItemClass: ItemClass): boolean {
  const instance = new ItemClass();
  return instance instanceof PassiveItem;
}

/**
 * Create an instance of an item by its class
 */
export function createItemInstance(ItemClass: ItemClass): Item {
  return new ItemClass();
}

/**
 * Find an item class by its ID
 */
export function getItemClassById(id: string): ItemClass | undefined {
  return ITEM_REGISTRY.find(ItemClass => {
    const instance = new ItemClass();
    return instance.id === id;
  });
}
