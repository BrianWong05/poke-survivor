# thunder-wave Specification

## Purpose
TBD - created by archiving change implement-thunder-wave. Update Purpose after archive.
## Requirements
### Requirement: Thunder Wave Core Mechanics
The Thunder Wave weapon MUST spawn multiple projectiles arranged in rotating lines radiating from the player, forming a "Laser Fence".

#### Scenario: Spawning the fence
- Given the player fires Thunder Wave
- When the weapon activates
- Then it spawns 3 (at lvl 1) equally spaced arms (0, 120, 240 degrees)
- And each arm consists of multiple `ThunderWaveNode` projectiles spaced ~20px apart
- And the nodes extend up to the specified `Radius`.

#### Scenario: Orbiting movement
- Given active Thunder Wave nodes
- When the frame updates
- Then all nodes rotate around the player at `Stats.Speed` degrees per second
- And they maintain their relative distance and alignment (forming rigid spokes).

### Requirement: Visuals
Nodes MUST have distinct visuals based on their position in the arm.

#### Scenario: Node Visuals
- Given a Thunder Wave node
- Then it renders as a small yellow sprite (`0xFFFF00`, scale 0.5)
- If it is the furthest node (Tip/Satellite), it renders larger (scale 1.2) with a blue core (`0x00FFFF`).
- And all nodes rotate to point away from the player center.

### Requirement: Collision Effects
The fence MUST provide defensive utility through knockback and stun.

#### Scenario: Hitting an enemy
- Given a node contacts an enemy
- Then it deals `Stats.Damage`
- And it applies `Stats.Knockback` strictly away from the player
- And it has `Stats.StunChance` (10% base) to apply a "stun" status for 1000ms.

### Requirement: Progression Stats
The weapon MUST follow a specific progression curve.

#### Scenario: Level 1 Stats
- ArmCount: 3
- Radius: 120
- Damage: 5
- Speed: 120
- Knockback: 200
- StunChance: 0.1

#### Scenario: Level Upgrades
- Lvl 2: Radius +30 (Total 150)
- Lvl 3: Damage +3 (Total 8)
- Lvl 4: ArmCount +1 (Total 4, Cross shape)
- Lvl 5: Speed +60 (Total 180)
- Lvl 6: Radius +40 (Total 190)
- Lvl 7: ArmCount +1 (Total 5, Star shape)
- Lvl 8: Infinite Duration (Permanent) & StunChance +0.2 (Total 0.3)

