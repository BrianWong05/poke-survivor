import type { WeaponConfig } from '@/game/entities/characters/types';

// Auto-import all specific weapon files
const modules = import.meta.glob('./specific/*.ts', { eager: true });

export const weapons: Record<string, WeaponConfig> = {};

// Helper to convert kebab-case to camelCase (e.g., 'aura-sphere' -> 'auraSphere')
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

for (const path in modules) {
  const mod = modules[path] as any;
  for (const key in mod) {
    const ExportedItem = mod[key];
    
    // Check if it's a class (constructor function) by checking for prototype methods we expect
    // Simple duck typing: must be function and have 'fire' in prototype or looks like a class
    if (typeof ExportedItem === 'function' && ExportedItem.prototype) {
      try {
        // Instantiate to check properties
        const instance = new ExportedItem();
        
        // Check if it matches WeaponConfig shape (has id, name, fire method)
        if (instance.id && typeof instance.fire === 'function') {
           const camelKey = toCamelCase(instance.id);
           weapons[camelKey] = instance;
        }
      } catch (e) {
        // Ignore non-constructible exports or errors
        // console.warn(`[Weapon Registry] Skipped export ${key} in ${path}:`, e);
      }
    }
  }
}
