# Implement Lick Weapon

## ADDED Requirements

### Requirement: Lick Weapon Config
The system MUST implement a `Lick` class implementing `WeaponConfig` with stats progression from Level 1 to 8.
#### Scenario: Level 1 Stats
At Level 1, `getStats` returns Damage 15, Area 1.0, Duration 150ms, Cooldown 1000ms.
#### Scenario: Level 8 Paralysis
At Level 8, `getStats` includes `paralysisChance: 0.3`.
#### Scenario: Directional Fire
`fire` spawn `LickHitbox` entity attached to player's facing direction.

### Requirement: Lick Hitbox Behavior
The system MUST implement a `LickHitbox` entity that handles visual and collision logic.
#### Scenario: Duration
Hitbox lasts for unique duration (150ms) then destroys itself.
#### Scenario: Damage Falloff
Each subsequent enemy hit by the same hitbox instance takes reduced damage (e.g., 15% less per previous hit).
#### Scenario: No Knockback
Hitting an enemy deals damage without applying knockback velocity.
#### Scenario: Paralysis Effect
Hitting an enemy has a chance (based on stats) to apply 0-vector knockback (stun).
