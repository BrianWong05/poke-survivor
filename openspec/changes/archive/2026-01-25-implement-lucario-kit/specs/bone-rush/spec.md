# Ability: Bone Rush

## ADDED Requirements

### Requirement: Bone Rush MUST auto-activate periodically
The Bone Rush ability MUST trigger automatically at fixed intervals.

#### Scenario: Activation cycle
Every 20 seconds, Bone Rush MUST activate automatically, spawning 4 `BoneProjectile`s.

### Requirement: Projectiles MUST orbit the player
The summoned bone projectiles MUST rotate around the player entity.

#### Scenario: Orbital mechanics
- Projectiles MUST orbit the player for 8 seconds.
- Orbit radius MUST expand and contract (Oscillating `100 + sin(t)*50`).
- Projectiles MUST deal contact damage (30) and high knockback.

### Requirement: Player MUST receive a speed buff
The player MUST gain increased movement speed while the ability is active.

#### Scenario: Speed modification
- While Bone Rush is active, player speed MUST be multiplied by 1.5.
- When Bone Rush ends, player speed MUST return to normal.
