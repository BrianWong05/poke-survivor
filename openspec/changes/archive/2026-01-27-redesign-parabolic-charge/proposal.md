# Redesign Parabolic Charge Visuals

## Why
The user requested a redesign to match reference images (Tadbulb/Miraidon). The desired look is an expanding electric field/ring with lightning, not simple orbiting dots.

## What Changes
- **Visuals:** Replace orbiting orbs with a **Pulsing Electric Field**.
  - A large semi-transparent yellow circle that surrounds the player.
  - Expanding concentric rings (Shockwaves).
  - "Lightning" sparks appearing within the field.
- **Behavior:** The hitbox should match this "Field" (effectively a large circular AoE around player).

## Risks
- **Visual Clutter:** A large filled circle might obscure vision. We must use low alpha (transparency).
