import { Item } from '@/game/entities/items/Item';

export abstract class PassiveItem extends Item {
  // Common passive logic could go here if needed.
  // For now, it mostly serves as a categorization class.
  
  // Passives usually don't need update loops, they just modify stats.
}
