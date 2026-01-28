import { Ember } from './specific/Ember';

import { Lick } from './specific/Lick';
import { BodySlam } from './specific/BodySlam';
import { AuraSphere } from './specific/AuraSphere';
import { FocusBlast } from './specific/FocusBlast';
import { WaterPulse } from './specific/WaterPulse';
import { Psywave } from './specific/Psywave';
import { AquaRing } from './specific/AquaRing';
import { WillOWisp } from './specific/WillOWisp';
import { PetalDance } from './specific/PetalDance';
import { StealthRock } from './specific/StealthRock';
import { ParabolicCharge } from './specific/ParabolicCharge';
import { ThunderWave } from './specific/ThunderWave';
import { SludgeBomb } from './specific/SludgeBomb';
import { Swift } from './specific/Swift';

export const ember = new Ember();

export const lick = new Lick();
export const bodySlam = new BodySlam();
export const auraSphere = new AuraSphere();
export const focusBlast = new FocusBlast();
export const psywave = new Psywave();
export const aquaRing = new AquaRing();
export const willOWisp = new WillOWisp();
export const petalDance = new PetalDance();
export const stealthRock = new StealthRock();
export const parabolicCharge = new ParabolicCharge();
export const thunderWave = new ThunderWave();
export const sludgeBomb = new SludgeBomb();
export const swift = new Swift();

// Exports for evolutions if needed directly (though usually accessed via weapon.evolution)
export const dreamEater = lick.evolution;



// ============================================================================
// PIKACHU WEAPONS
// ============================================================================


import { ThunderShock } from './specific/ThunderShock';
export const thunderShock = new ThunderShock();

// ============================================================================
// BLASTOISE WEAPONS
// ============================================================================


/**
 * Water Pulse: High speed pulses of water
 */
export const waterPulse = new WaterPulse();
