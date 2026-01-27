# Spec: Water Pulse Weapon

## ADDED Requirements

### Requirement: Weapon Configuration
The `WaterPulse` class MUST implement the `WeaponConfig` interface and define the specific progression stats.

#### Scenario: Initial Stats (Level 1)
  - When the weapon is Level 1
  - Then it has Damage 4, Count 1, Pierce 0, Speed 700, Cooldown 400ms, Knockback 150.

#### Scenario: Evolution (Level 8)
  - When the weapon reaches Level 8
  - Then the Cooldown drops to 200ms (Machine Gun mode) and Pierce is 2.

### Requirement: Projectile Behavior
The `WaterPulseShot` projectile MUST handle movement, visuals, and collision consequences.

#### Scenario: Visuals
  - When a shot is fired
  - Then it should be tinted `0x00FFFF` (Cyan).

#### Scenario: Piercing
  - When a shot hits an enemy
  - And `pierce` is > 0
  - Then the shot continues but `pierce` is decremented.
  - And it adds the enemy to a `hitList` to avoid double-hitting.

#### Scenario: Knockback Application
  - When a shot hits an enemy
  - Then it calculates the vector from projectile to enemy.
  - And calls `enemy.applyKnockback(vector, 100)`.
