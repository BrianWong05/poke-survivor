# Redesign Aqua Ring Visuals

## Why
The user requested a redesign of the Aqua Ring weapon to match the anime visuals (specifically Swanna's usage), which depicts multiple concentric shimmering rings rather than a single orbit of orbs.

## What Changes
- **Concentric Rings:** The `AquaRing` weapon will now spawn 3 layers of projectiles (Inner, Middle, Outer) to simulate a thick "ring" or veil.
- **Visuals:** Projectiles will have added sparkle effects to mimic the "shimmering water" aesthetic.
- **Hitbox:** The effective area of effect will increase due to the wider spread of projectiles.

## Risks
- **Performance:** Tripling the number of projectiles could impact performance. We will keep the per-ring count moderate to balance this.
- **Visual Clutter:** Might obscure the player or enemies. Transparency (alpha) will be key.
