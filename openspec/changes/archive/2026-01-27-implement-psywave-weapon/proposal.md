# Proposal: Implement Psywave (Orbiting Weapon)

## Summary
Implement the "King Bible" archetype weapon **Psywave (精神波)**. This weapon creates orbiting projectiles around the player that damage enemies on contact. It features a specific progression system for count, duration, speed, and radius, culminating in an infinite duration at Level 8.

## Motivation
To add a defensive/zoning weapon option (Orbit archetype) to the game, providing players with close-range protection.

## Proposed Solution
- Create a self-contained `Psywave.ts` file including both the `Psywave` weapon config and `PsywaveShot` projectile logic.
- Implement explicit level progression (1-8).
- Implement orbital physics using basic trigonometry (`cos`, `sin`) updated by `delta` time.
- Implement "immunity frames" for the projectile so it can hit multiple times but not every frame.

## Risks
- **Performance:** Orbiting projectiles need to update position every frame. Optimization might be needed if count is high (max 6 is low, so risk is low).
- **Cleanup Glitches:** Ensuring old projectiles are properly destroyed before spawning new ones to avoid "double dipping" damage or visual clutter.
