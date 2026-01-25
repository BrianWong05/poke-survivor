# Water Gun & Hydro Pump Requirements

## ADDED Requirements

### Requirement: Water Gun Projectile (WaterShot)
The projectile SHALL be a blue circle that applies knockback and pierces enemies.
Scale: 1.0 (default) or 3.0 (Hydro Pump).
Texture: Blue Circle (`0x00BFFF`).

#### Scenario: Hitting an Enemy
- WHEN a `WaterShot` collides with an `Enemy`
- THEN damage is dealt to the enemy
- AND a knockback velocity is applied to the enemy away from the projectile
- AND the projectile's pierce count is decremented
- AND the projectile is destroyed if pierce < 0

### Requirement: Water Gun Mechanics
The weapon SHALL fire projectiles with specific stats based on level.
Levels 1-7 statistics: Cooldown 900ms, Damage 8, Knockback 300, Pierce 1.
Level 8+ statistics: Cooldown 1500ms, Damage 25, Knockback 800, Pierce 999.

#### Scenario: Firing Water Gun (Level 1)
- GIVEN the weapon is Level 1
- AND cooldown is ready
- AND an enemy exists
- WHEN `fire()` is called
- THEN a projectile is fired towards the nearest enemy
- AND the projectile has size 1.0, damage 8, knockback 300, pierce 1

#### Scenario: Firing Hydro Pump (Level 8)
- GIVEN the weapon is Level 8
- AND cooldown is ready
- WHEN `fire()` is called
- THEN a projectile is fired towards the nearest enemy
- AND the projectile has size 3.0, damage 25, knockback 800, pierce 999
