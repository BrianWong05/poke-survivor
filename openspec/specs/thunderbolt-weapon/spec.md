# thunderbolt-weapon Specification

## Purpose
TBD - created by archiving change implement-thunderbolt. Update Purpose after archive.
## Requirements
### Requirement: Upgrade Configuration
The weapon MUST follow specific level progression stats for Damage, Count, Cooldown, Area, and Stun Chance.

#### Scenario: Level 1 Stats
- Given the weapon is at Level 1
- Then it should have Damage: 20, Count: 2, Cooldown: 1500ms, Area: 1.0, StunChance: 0.3

#### Scenario: Max Level Progression
- Given the weapon reaches Level 8
- Then it should have Count: 10 (Thunderstorm) and Damage: 50

### Requirement: Fire Logic
The weapon MUST select random targets from active enemies or fallback to random screen positions.

#### Scenario: Enemies Present
- Given there are 5 active enemies
- And the weapon count is 3
- When it fires
- Then it should select 3 distinct random enemies
- And apply instant damage to them
- And chance to apply stun

#### Scenario: No Enemies
- Given there are 0 active enemies
- When it fires
- Then it should strike random positions within the camera view

### Requirement: Strike Logic
The weapon MUST display a visual-only lightning strike.

#### Scenario: Visual Execution
- When a strike is spawned
- Then it should display a projectile or graphics line
- And it should stretch vertically
- And it should fade out after ~100ms

