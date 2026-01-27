# Proposal: Implement Water Pulse Weapon

## Problem
The game lacks water-elemental weaponry and the current enemy physics system overwrites knockback forces with movement logic immediately (ticks), making impact effects negligible.

## Solution
1.  Add a new `WaterPulse` weapon with a high-speed, piercing projectile behavior.
2.  Update the base `Enemy` class to support a "Stun/Knockback" state that temporarily overrides movement AI.

## Risks
*   **Physics Glitches:** Knockback might push enemies into walls or out of bounds if not clamped (though Phaser arcade physics usually handles this).
*   **Performance:** High fire rate projectiles (Machine Gun at Lvl 8) with collision checks might impact performance if object pooling isn't efficient (will use existing projectile pool).
