# Proposal: Implement Ember Weapon Progression

This proposal outlines the refactoring of the `Ember` weapon to implement a "Shotgun" style progression system, scaling from Level 1 to 8. It also includes adding synergy between the projectile and the `BurningGround` hazard.

## Changes

### 1. Ember Weapon Refactor
- Implement `getStats(level)` to handle progression stats (Damage, Count, Pierce, Speed, Cooldown).
- Update `fire()` logic to support multi-projectile "Spread" firing.
- Specific Level Scaling:
    - **Lvl 1:** Dmg 10, Count 1, Pierce 0, Speed 400, CD 1200ms.
    - **Lvl 2:** Dmg 15.
    - **Lvl 3:** Count 2 (Spread).
    - **Lvl 4:** Pierce 1.
    - **Lvl 5:** Dmg 20.
    - **Lvl 6:** Count 3.
    - **Lvl 7:** Pierce 2.
    - **Lvl 8:** CD 1000ms.

### 2. Mechanics & Visuals
- **Spread Pattern:** 15-degree spread for multi-projectile levels.
- **Visual Polish:** Randomize projectile speed (0.9x - 1.1x).
- **Hazard Synergy:** Pass projectile damage to `BurningGround` (e.g., 50% of impact damage).

### 3. Constraints
- Evolution is explicitly **OUT OF SCOPE**.
