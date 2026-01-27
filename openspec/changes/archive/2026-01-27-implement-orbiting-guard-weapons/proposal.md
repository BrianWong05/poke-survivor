# Proposal: Orbiting Guard Weapons

## Summary
Implement 5 distinct "Orbiting Guard" archetype weapons: **Aqua Ring**, **Will-O-Wisp**, **Petal Dance**, **Stealth Rock**, and **Parabolic Charge**. Each will share the base orbiting mechanics but feature unique visuals, stats, and on-hit effects.

## Motivation
To expand the defensive "Orbit" archetype with diverse elemental options and playstyles (CC, DoT, DPS, Tank, Sustain).

## Proposed Solution
- Create 5 new files in `src/game/entities/weapons/specific/` following the `Psywave.ts` pattern.
- Each file will contain a `WeaponConfig` class and a `Shot` class extending `Phaser.Physics.Arcade.Sprite`.
- The `Shot` classes will implement:
  - Orbit physics (`cos`/`sin` by `currentAngle`).
  - `hitList` for immunity frames.
  - Custom `onHit` logic (Knockback, Burn, Heal, etc.).

## Visuals & Effects
- **Aqua Ring:** Cyan (`0x00FFFF`), applies Knockback away from player.
- **Will-O-Wisp:** Purple/Orange (`0x800080`), applies Burn (DoT).
- **Petal Dance:** Pink (`0xFF69B4`), high speed/count grinder.
- **Stealth Rock:** Brown (`0x8B4513`), high damage/slow heavy hitter.
- **Parabolic Charge:** Yellow (`0xFFFF00`), heals player on hit.

## Risks
- **Performance:** 5 active orbital weapons could result in many projectiles (Petal Dance especially). 
- **Balance:** Healing from Parabolic Charge might be too strong if count/tick rate is high. Will limit to 1HP per proc.
