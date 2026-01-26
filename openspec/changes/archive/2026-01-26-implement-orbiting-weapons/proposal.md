# Proposal: Implement Orbiting Weapon System

## Context
The game requires a new weapon archetype: "Orbiting System" (similar to King Bible in Vampire Survivors). This system needs to be generic enough to support elemental variants (Fire, Water, Grass) for different Pokémon.

## Goals
1.  Create a generic `OrbitProjectile` that orbits the player without using physics velocity.
2.  Create a generic `OrbitWeapon` class that handles spawning and managing these projectiles.
3.  Implement three distinct variants:
    *   **Flame Wheel (Fire)**: Fast spin, burn effect.
    *   **Aqua Ring (Water)**: Defensive, high knockback.
    *   **Magical Leaf (Grass)**: Pierce focus.
4.  Implement evolution paths for all three variants (Fire Spin, Hydro Ring, Leaf Storm).

## Non-Goals
*   Visual effects beyond simple sprites/tints initially (unless specified).
*   Integration into the loot table (filtering logic is a bonus requirement but not the primary goal, though we will provide the helper method).

## Risks
*   **Performance**: Many rotating sprites might be costly if not managed well, but Phaser should handle a few dozen fine.
*   **Hit Detection**: Rotating projectiles might have weird collision issues if physics bodies don't update correctly. Explicit position updates need to sync with Arcade physics body.
