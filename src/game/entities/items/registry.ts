import { Item } from './Item';
import { HpUp } from './passive/HpUp';
import { Leftovers } from './passive/Leftovers';
import { Iron } from './passive/Iron';

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
