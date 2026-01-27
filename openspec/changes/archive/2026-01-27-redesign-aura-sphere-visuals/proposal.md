# Proposal: Redesign Aura Sphere Visuals

**Change ID:** `redesign-aura-sphere-visuals`

## Summary
Upgrade the visual representation of the Aura Sphere weapon from a simple blue circle to a high-fidelity "Energy Sphere" effect, featuring a bright core, glowing aura, and possibly swirling energy effects, inspired by Lucario's signature move.

## Context
The user has provided reference images showing a complex, glowing blue energy ball. The current implementation is a flat color circle (`0x00BFFF`). To improve the "premium" feel and match the reference, we need a multi-layered procedural texture generation.

## Goals
1.  **Complex Texture:** Generate a texture with:
    -   **Bright Core:** White/Near-white center.
    -   **Inner Glow:** Cyan/Electric Blue body.
    -   **Outer Halo:** Fainter blue glow.
    -   **Energy Swirls:** Use arcs or uneven shading to suggest rotation.
2.  **Animation:**
    -   **Rotation:** Rotate the sprite (or an overlay) to simulate swirling energy.
    -   **Pulse:** Slight scale pulsation to make it feel "alive".
3.  **Particles:** Add a simple particle trail (blue/cyan) to emphasize speed and trajectory.

## Non-Goals
- Changing weapon stats or mechanics (Damage, Homing, etc. remain unchanged).
- Importing external image assets (we will use procedural generation for flexibility and to avoid copyright/asset management issues).
