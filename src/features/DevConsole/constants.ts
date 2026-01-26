import { 
    FLAME_WHEEL_CONFIG, 
    AQUA_RING_CONFIG, 
    MAGICAL_LEAF_CONFIG,
    FIRE_SPIN_CONFIG,
    HYDRO_RING_CONFIG,
    LEAF_STORM_CONFIG,
} from '@/game/entities/weapons/general/OrbitWeapon';
// Specific Weapons
import { Ember, Flamethrower } from '@/game/entities/weapons/specific/Ember';
import { WaterGun, HydroPump } from '@/game/entities/weapons/specific/WaterGun';
import { ThunderShock, Thunderbolt } from '@/game/entities/weapons/specific/ThunderShock';
import { Lick, DreamEater } from '@/game/entities/weapons/specific/Lick';
import { AuraSphere } from '@/game/entities/weapons/specific/AuraSphere';
import { FocusBlast } from '@/game/entities/weapons/specific/FocusBlast';
import { BodySlam } from '@/game/entities/weapons/specific/BodySlam';
import { BoneRush } from '@/game/entities/weapons/specific/BoneRush';

import { type DevMove } from './types';

export const AVAILABLE_MOVES: DevMove[] = [
    { name: 'Ember', create: () => new Ember() },
    { name: 'Flamethrower', create: () => new Flamethrower(), outline: true },
    { name: 'Water Gun', create: () => new WaterGun() },
    { name: 'Hydro Pump', create: () => new HydroPump(), outline: true },
    { name: 'Thunder Shock', create: () => new ThunderShock() },
    { name: 'Thunderbolt', create: () => new Thunderbolt(), outline: true },
    { name: 'Lick', create: () => new Lick() },
    { name: 'Dream Eater', create: () => new DreamEater(), outline: true },
    { name: 'Aura Sphere', create: () => new AuraSphere() },
    { name: 'Focus Blast', create: () => new FocusBlast(), outline: true },
    { name: 'Body Slam', create: () => new BodySlam() },
    { name: 'Bone Rush', create: () => new BoneRush() },
    // Orbit Weapons
    { name: 'Flame Wheel', create: () => FLAME_WHEEL_CONFIG, outline: false },
    { name: 'Fire Spin', create: () => FIRE_SPIN_CONFIG, outline: true },
    { name: 'Aqua Ring', create: () => AQUA_RING_CONFIG, outline: false },
    { name: 'Hydro Ring', create: () => HYDRO_RING_CONFIG, outline: true },
    { name: 'Magical Leaf', create: () => MAGICAL_LEAF_CONFIG, outline: false },
    { name: 'Leaf Storm', create: () => LEAF_STORM_CONFIG, outline: true },
];
