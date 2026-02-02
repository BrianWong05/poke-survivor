## ADDED Requirements

### Requirement: Enemy Tracks Individual Attack Timer
Each enemy MUST track its own `lastAttackTime` property to record when it last dealt damage to the player.

#### Scenario: Fresh enemy can attack immediately
- **WHEN** an enemy is spawned or recycled from pool
- **THEN** its `lastAttackTime` MUST be set to 0
- **AND** the enemy MUST be able to attack immediately on first contact

#### Scenario: Same enemy cannot rapid-fire
- **GIVEN** an enemy has just dealt damage to the player
- **WHEN** the same enemy touches the player again within 500ms
- **THEN** the enemy MUST NOT deal damage

#### Scenario: Same enemy can attack after cooldown
- **GIVEN** an enemy dealt damage to the player at time T
- **WHEN** the same enemy touches the player at time T + 500ms or later
- **THEN** the enemy MUST deal damage
- **AND** `lastAttackTime` MUST be updated to the new attack time

---

### Requirement: Enemy Provides Attack Availability Methods
Each enemy MUST expose `canAttack(time: number): boolean` and `onAttack(time: number)` methods.

#### Scenario: canAttack returns true when cooldown elapsed
- **GIVEN** an enemy's `lastAttackTime` is 1000
- **WHEN** `canAttack(1600)` is called (600ms later)
- **THEN** the method MUST return `true`

#### Scenario: canAttack returns false during cooldown
- **GIVEN** an enemy's `lastAttackTime` is 1000
- **WHEN** `canAttack(1400)` is called (400ms later)
- **THEN** the method MUST return `false`

#### Scenario: onAttack updates timer
- **GIVEN** an enemy's `lastAttackTime` is 0
- **WHEN** `onAttack(5000)` is called
- **THEN** `lastAttackTime` MUST be set to 5000

---

### Requirement: Collision Handler Uses Per-Enemy Cooldown
The player-enemy collision handler MUST check the enemy's attack cooldown instead of the player's global invulnerability.

#### Scenario: Multiple distinct enemies hit simultaneously
- **GIVEN** Enemy A and Enemy B both have cooldown available
- **WHEN** both enemies overlap the player in the same frame
- **THEN** the player MUST take damage from both enemies

#### Scenario: Same enemy in cooldown is ignored
- **GIVEN** Enemy A has an active cooldown (attacked within 500ms)
- **WHEN** Enemy A overlaps the player
- **THEN** the player MUST NOT take damage from Enemy A
