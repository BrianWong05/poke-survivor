import type { Item } from '@/game/entities/items/Item';

// Map to store item data
interface ItemData {
  Constructor: new () => Item;
  name: string;
}

const itemRegistry: Map<string, ItemData> = new Map();
const canonicalItems: { id: string, name: string }[] = [];

/**
 * Auto-discover and register all passive items in the 'passive' directory.
 */
const passiveModules = import.meta.glob('./passive/*.ts', { eager: true });

for (const path in passiveModules) {
  // Skip base classes or internal files
  if (path.includes('PassiveItem.ts')) continue;

  const mod = passiveModules[path] as any;
  for (const key in mod) {
    const ExportedClass = mod[key];
    if (typeof ExportedClass === 'function') {
      try {
        const instance = new ExportedClass() as Item;
        if (instance.id) {
          const data: ItemData = {
            Constructor: ExportedClass,
            name: instance.name
          };

          // Register by its primary internal ID
          itemRegistry.set(instance.id, data);
          canonicalItems.push({ id: instance.id, name: instance.name });
          
          // Register aliases for internal consistency, but don't add to canonical list
          const aliasId = instance.id.includes('-') 
            ? instance.id.replace(/-/g, '_') 
            : instance.id.replace(/_/g, '-');
          
          if (aliasId !== instance.id) {
            itemRegistry.set(aliasId, data);
          }
        }
      } catch (e) {
        // Skip exports that aren't instantiable with new() or aren't Items
      }
    }
  }
}

/**
 * Creates an item instance by ID.
 */
export function createItem(id: string): Item | null {
  const data = itemRegistry.get(id);
  if (data) {
    return new data.Constructor();
  }

  console.warn(`[ItemRegistry] Unknown item ID: ${id}`);
  return null;
}

/**
 * List of available items for selection UI.
 * Unique canonical items only.
 */
export const AVAILABLE_ITEMS = Array.from(
  new Map(canonicalItems.map(item => [item.id, item])).values()
).sort((a, b) => a.name.localeCompare(b.name));
