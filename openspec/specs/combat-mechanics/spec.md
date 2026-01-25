# combat-mechanics Specification

## Purpose
TBD - created by archiving change implement-body-slam. Update Purpose after archive.
## Requirements
### Requirement: Shockwave Entity
The system MUST provide a `Shockwave` entity that spawns, expands, and dissipates.

#### Scenario: Spawn behavior
  - GIVEN the player fires Body Slam
  - WHEN the Shockwave appears
  - THEN it starts small (0.1 scale) and expands to target scale over 300ms
  - AND it fades from alpha 1 to 0 simultaneous to the expansion
  - AND it destroys itself after the tween completes

#### Scenario: Hit Registration
  - GIVEN a Shockwave is active and expanding
  - WHEN it overlaps multiple enemies
  - THEN it MUST damage and knockback ALL overlapped enemies (Infinite Pierce)
  - BUT it MUST NOT damage the same enemy more than once per single Shockwave instance

### Requirement: Body Slam Weapon
The system MUST provide the `BodySlam` weapon configuration for early levels.

#### Scenario: Base Stats
  - GIVEN the weapon is level 1
  - THEN the Damage is 20
  - AND the Knockback is 500 (Massive)
  - AND the Cooldown is 2000ms
  - AND the Radius is 150px
  - AND the color is Default (White)

### Requirement: Giga Impact Evolution
The system MUST provide the `GigaImpact` evolution for high levels.

#### Scenario: Evolved Stats
  - GIVEN the weapon evolves to Giga Impact
  - THEN the Damage increases to 50
  - AND the Radius increases to 400px
  - AND the Visual changes to Purple (`0x800080`)
  - AND it applies a 1-second Stun effect to enemies

### Requirement: Stun Mechanic
The system MUST support stunning enemies.

#### Scenario: Stun Application
  - GIVEN an enemy is hit by Giga Impact
  - THEN their movement is halted for 1 second
  - AND they resume normal behavior after the duration

