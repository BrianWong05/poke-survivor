# Weapon: Sludge Bomb

## ADDED Requirements

### Requirement: Stats & Upgrades
The weapon SHALL define progression statistics for levels 1 through 8.

#### Scenario: Acquiring and Upgrading Sludge Bomb
- **Given** the player levels up and selects "Sludge Bomb",
- **Then** the weapon should initialize with the following Stats at Level 1:
    - Damage: 10
    - Cooldown: 3000ms
    - Count: 2
    - Duration: 3000ms
    - Radius: 100
    - Speed: 300
- **And** subsequent levels should adjust stats as follows:
    - L2: Duration +1000ms (4000ms total)
    - L3: Damage +5 (15 total)
    - L4: Count +1 (3 total)
    - L5: Radius +20 (120 total)
    - L6: Count +1 (4 total)
    - L7: Damage +10 (25 total)
    - L8: Count +1 (5 total) AND Radius +30 (150 total, "Huge Puddle")

### Requirement: Fire Logic
The weapon projectiles SHALL target distinct active enemies when possible.

#### Scenario: Firing Logic (Distinct Targeting)
- **Given** the weapon is off cooldown and fires multiple projectiles (Count > 1),
- **When** the `fire` method is triggered,
- **Then** it should identify all enemies within 400px range, sorted by distance to player.
- **And** for each projectile `i` (from 0 to Count-1):
    - IF an enemy exists at index `i` in the sorted list (Candidate `i`):
        - Target that distinct enemy's position.
    - ELSE (no enemy or index `i` out of bounds):
        - Target a random spot within 150px of the player (fallback).
    - Add a small random offset (-20 to +20) to the final target coordinates.
- **And** create a temporary visual projectile (Purple "Blob" or Cluster) that tweens to the target.
- **And** the projectile should simulate a "lob" arc (e.g. scale Y or slight Y-offset curve) during flight.
- **And** upon tween completion, the projectile should be destroyed and a `SludgeZone` should be spawned at the target location.

### Requirement: Zone Logic
The sludge zone SHALL deal damage over time to overlapping enemies.

#### Scenario: Sludge Zone Logic
- **Given** a `SludgeZone` has spawned,
- **Then** it should be a persistent object with an organic, "splattered" visual (not a perfect circle).
- **And** it should persist for the duration specified by the weapon stats (3000ms-5000ms).
- **And** it should damage enemies overlapping its radius every 500ms.
- **And** the damage check should use a manual distance check against enemies for clean hit detection.
- **And** the zone should disappear after its duration expires.
