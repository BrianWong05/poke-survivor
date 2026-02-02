export interface ItemConfig {
    id: string;
    name: string;
    nameKey: string;
    description: string;
    type: 'passive' | 'weapon';
    spriteKey: string;
    maxLevel: number;
    stats: {
        might?: number;
        defense?: number;
        maxHP?: number;
        amount?: number;
        growth?: number;
        greed?: number;
    }
}

export const MUSCLE_BAND: ItemConfig = {
    id: 'muscle_band',
    name: 'Muscle Band',
    nameKey: 'item_muscle_band', // For localization
    description: 'Increases Damage output.',
    type: 'passive',
    spriteKey: 'muscle_band',
    maxLevel: 5,
    stats: {
        might: 0.10, // +10% per level
    }
};

export const LOADED_DICE: ItemConfig = {
    id: 'loaded_dice',
    name: 'Loaded Dice',
    nameKey: 'item_loaded_dice',
    description: 'Weapon projectile amount +1.',
    type: 'passive',
    spriteKey: 'loaded_dice',
    maxLevel: 2,
    stats: {
        amount: 1, // +1 Projectile count per level (Total +2)
    }
};

export const LUCKY_EGG: ItemConfig = {
    id: 'lucky_egg',
    name: 'Lucky Egg',
    nameKey: 'item_lucky_egg',
    description: 'Gain 10% more experience.',
    type: 'passive',
    spriteKey: 'lucky_egg',
    maxLevel: 5,
    stats: {
        growth: 0.10, // +10% Growth per level
    }
};

export const AMULET_COIN: ItemConfig = {
    id: 'amulet_coin',
    name: 'Amulet Coin',
    nameKey: 'item_amulet_coin',
    description: 'Gain 20% more gold coins.',
    type: 'passive',
    spriteKey: 'amulet_coin',
    maxLevel: 5,
    stats: {
        greed: 0.20, // +20% Gold Multiplier per level
    }
};
