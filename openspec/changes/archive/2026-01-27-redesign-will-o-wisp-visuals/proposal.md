# Redesign Will-O-Wisp Visuals

## Why
The user requested a redesign to match reference images of Gengar/Yamask using the move. The desired look is large, "ghostly" purple fireballs that leave a trail, rather than static orbiting dots.

## What Changes
- **Visuals:** Change tint to a brighter purple/pink and create a "Flame Trail" effect using decaying particles.
- **Scale:** Increase projectile size to represent fireballs.

## Risks
- **Performance:** Trails might add draw calls. We will limit trail length/frequency.
