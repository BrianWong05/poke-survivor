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
