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
        magnet?: number;
        regen?: number;
    }
}

