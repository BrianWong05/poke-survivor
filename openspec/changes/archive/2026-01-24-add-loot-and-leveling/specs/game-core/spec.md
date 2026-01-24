## MODIFIED Requirements

### Requirement: XP Collection Economy
The system SHALL allow the player to collect tiered XP gems with varying values and spawn probability.

#### Scenario: Player collects XP gem
- **WHEN** the player overlaps with an XP gem
- **THEN** the XP gem is destroyed
- **AND** the player gains XP equal to the gem's tier value (1, 10, 50, or 100)
- **AND** the ExperienceManager `addXP()` method is called with the tier value
- **AND** an `xp-update` event is emitted to React with current XP, max XP, and level

#### Scenario: Exp Candy drop on enemy death
- **WHEN** a regular enemy is destroyed
- **THEN** an Exp Candy is spawned at the enemy's position with the following probability:
  - 70% chance: EXP_CANDY_S (1 XP)
  - 20% chance: EXP_CANDY_M (10 XP)
  - 8% chance: EXP_CANDY_L (50 XP)
  - 2% chance: EXP_CANDY_XL (100 XP)

#### Scenario: Rare Candy drop on boss death
- **WHEN** a boss enemy is destroyed
- **THEN** a RARE_CANDY (200 XP) is spawned at the boss's position

#### Scenario: Exp Candy visual differentiation
- **WHEN** an Exp Candy is spawned
- **THEN** the candy's texture corresponds to its tier:
  - EXP_CANDY_S: Small yellow circle
  - EXP_CANDY_M: Medium orange circle
  - EXP_CANDY_L: Large red circle
  - EXP_CANDY_XL: Extra large purple circle
  - RARE_CANDY: Cyan square with glow effect

---

### Requirement: Entity Pooling
The system SHALL use object pooling for frequently spawned entities to maintain performance, including gem culling.

#### Scenario: Enemy spawning with pool
- **WHEN** a new enemy is needed
- **THEN** an inactive enemy from the pool is reused if available
- **OR** a new enemy is created if the pool is empty

#### Scenario: Entity destruction returns to pool
- **WHEN** an enemy, projectile, or XP gem is destroyed
- **THEN** the entity is deactivated and returned to its pool

#### Scenario: Gem count exceeds threshold
- **WHEN** the loot group contains more than 300 active gems
- **THEN** the 50 gems furthest from the player are destroyed
- **AND** performance is maintained at 60fps

---

## ADDED Requirements

### Requirement: Level Up Pause
The system SHALL pause the game scene when the player levels up.

#### Scenario: Level up triggers pause
- **WHEN** `ExperienceManager.addXP()` returns `true` (level up occurred)
- **THEN** `this.scene.pause()` is called
- **AND** "Level Up Menu Open" is logged to the console

#### Scenario: Game resumes after level up
- **WHEN** the level-up menu is dismissed (future implementation)
- **THEN** `this.scene.resume()` is called
- **AND** gameplay continues
