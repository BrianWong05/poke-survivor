import { Item } from '@/game/entities/items/Item';
import { HpUp } from '@/game/entities/items/passive/HpUp';
import { Leftovers } from '@/game/entities/items/passive/Leftovers';
import { Iron } from '@/game/entities/items/passive/Iron';

export function createItem(id: string): Item | null {
  switch (id) {
    case 'hp-up': return new HpUp();
    case 'leftovers': return new Leftovers();
    case 'iron': return new Iron();
    default:
      console.warn(`[ItemRegistry] Unknown item ID: ${id}`);
      return null;
  }
}

export const AVAILABLE_ITEMS = [
  'hp-up',
  'leftovers',
  'iron'
];
