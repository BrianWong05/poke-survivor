## ADDED Requirements

### Requirement: Weapon Firing Mechanics
The weapon SHALL automatically fire projectiles at the nearest enemy within range.
#### Scenario: Firing at nearest enemy
-   **Given** the player is active and has Thunder Shock weapon
-   **And** there is at least one active enemy on screen
-   **When** the weapon cooldown (1000ms) elapses
-   **Then** a `LightningBolt` projectile is fired
-   **And** the projectile moves towards the enemy's position at time of firing (speed 400)
-   **And** the projectile is yellow (0xFFFF00) and rotated towards movement

### Requirement: Projectile Behavior
The projectile SHALL deal damage and have a chance to inflict status effects on impact.
#### Scenario: Stun Effect
-   **Given** a LightningBolt hits an enemy
-   **When** the collision occurs
-   **Then** the enemy takes 10 damage
-   **And** there is a 20% chance the enemy is visually Stunned (stopped) for 0.5s
-   **And** the projectile is destroyed

### Requirement: Evolution
The weapon SHALL upgrade to a stronger version upon reaching a specific character level.
#### Scenario: Evolution to Thunderbolt
-   **Given** the player reaches Level 8
-   **When** the weapon evolves
-   **Then** the weapon becomes "Thunderbolt"
-   **And** it fires 2 projectiles (or deals 20 damage)
