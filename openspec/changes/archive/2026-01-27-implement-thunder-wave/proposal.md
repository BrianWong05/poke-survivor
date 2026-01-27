# Proposal: Implement Thunder Wave (Laser Fence Archetype)

## Summary
Implement the **Thunder Wave** weapon, a new electric-type weapon featuring a "Laser Fence" archetype using rotating lines of satellites.

## Problem
The game lacks an electric-type area control weapon that provides a persistent defensive barrier ("Laser Fence") distinct from simple orbiting projectiles (like Orbiting Stars) or stationary zones (like Lava).

## Solution
Create `ThunderWave` and `ThunderWaveNode`:
1.  **Archetype**: "Rotating Spoked Wheel" - 3+ radiating lines of projectiles.
2.  **Mechanic**: Spawns multiple "node" projectiles per arm to visually form a line. Nodes orbit the player at fixed relative angles and distances.
3.  **Progression**: Increases arm count (Lines), radius (Length), and rotation speed.
4.  **Status**: Applies a chance to STUN enemies.

## Risks
- **Performance**: High number of projectiles (nodes) if radius gets large. Level 1 has ~18 nodes (3 arms * 6 nodes). Level 8 could have many more.
    - *Mitigation*: Nodes are simple sprites. We might need Object Pooling if creation/destruction is frequent, but Level 8 is "Infinite Duration", reducing churn.
- **Visual Clarity**: rotating lines might obscure the screen.
    - *Mitigation*: Use small sprites for nodes, distinct "Satellite" sprites for tips.

## Alternatives Considered
- **Single Beam/Raycast**: Instead of nodes, use a single stretched sprite or Graphics object.
    - *Rejected*: User request specifically asks for "Chain" logic with nodes and "orbiting satellites". Nodes allow for granular collision and "breaking" effects if desired later. Projectile system is already robust.
