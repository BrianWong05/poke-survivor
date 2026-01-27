# Proposal: Redesign Water Pulse Visuals

## Why
The current Water Pulse projectile is a simple "blue circle dot" (generated graphic). This does not match the energetic, ripple/ring-like visual effect associated with the move "Water Pulse" in reference materials. The user explicitly requested a redesign to match reference images (expanding blue rings).

## What Changes
We will replace the simple circle texture with a generated visuals that mimic water rings/pulses.

### Visual Requirements
- **Texture**: Instead of a filled circle, generate a **ring** or **ripple** texture (hollow circle with thick stroke).
- **Animation**: The projectile should rotate or pulse to feel dynamic.
- **Color**: Maintain the Cyan/Blue water aesthetic (`0x00FFFF` or similar).

### Implementation Strategy
1.  **Update Texture Generation**: Modify `WaterPulseShot` texture generation to draw a ring (strokeCircle) instead of a filled circle.
2.  **Add Animation**: Ensure the projectile rotates as it travels (already implemented via `setRotation` on fire, but we might want spin).
3.  **Scale**: Possibly increase scale or add a tween to make the ring expand/contract slightly.

## Validation logic
- **Visual Check**: Projectile looks like a ring/ripple.
- **Game Physics**: Hitbox remains accurate (circle radius might need adjustment if visual changes significantly).
