
import * as weapons from '@/game/entities/weapons/index';
import type { WeaponConfig } from '@/game/entities/characters/types';

export interface DevMove {
    name: string;
    create: () => any;
    outline?: boolean;
}

// Helper to determine if an object is a valid weapon config
const isWeapon = (obj: any): obj is WeaponConfig => {
    return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj && 'fire' in obj;
};

// Start with all exported values from the weapons index
const allExports = Object.values(weapons);

// Detect evolutions to outline them
const evolutionIds = new Set<string>();
allExports.forEach(exp => {
    if (isWeapon(exp) && exp.evolution) {
        // checks if evolution is a weapon config object or just a reference?
        // usually it's a WeaponConfig object.
        if (isWeapon(exp.evolution)) {
            evolutionIds.add(exp.evolution.id);
        }
    }
});

export const AVAILABLE_MOVES: DevMove[] = allExports
    .filter(isWeapon)
    .map((weapon) => ({
        name: weapon.name,
        create: () => weapon, // Return the singleton/instance itself
        outline: evolutionIds.has(weapon.id)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
