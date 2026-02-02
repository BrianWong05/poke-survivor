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
