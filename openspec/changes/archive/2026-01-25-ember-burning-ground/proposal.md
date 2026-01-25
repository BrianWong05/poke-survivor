# Proposal: Ember Burning Ground Upgrade

**Goal**: Upgrade Charmander's Ember weapon to leave a "Burning Ground" hazard when the fireball hits an enemy. This adds area-of-effect damage over time.

## Capabilities

### 1. Hazard System Support
The system needs to manage environmental hazards that damage enemies entering their area.
- Add `hazardGroup` to `MainScene`.
- Implement `handleHazardDamage` which respects a per-enemy tick rate to prevent instant kills.

### 2. Burning Ground Hazard
A new entity that exists for 3 seconds and deals 3 damage every 500ms to enemies inside it.

### 3. Ember Weapon Update
Modify `Fireball.ts` to spawn the `BurningGround` hazard on collision.
Reduce Ember's base damage from 10 to 8 to account for the new DOT potential.

## Architecture
- **Hazard Entity**: `src/game/entities/hazards/BurningGround.ts`.
- **Scene Integration**: Update `MainScene.ts` to manage hazards and damage.
- **Weapon System**: Modification to `Fireball.ts` (projectile) and `Ember.ts` (base damage).
- **Enemy State**: Add `lastHazardHitTime` to enemies to track damage intervals.
