# Spec: Enemy HP Scaling

## Background
Enemies currently spawn with fixed HP defined in `EnemyConfig`. We want to dynamically scale this HP based on the player's level to maintain difficulty.

## ADDED Requirements

### Requirement: HP Scaling Formula
The enemy HP MUST scale linearly with player level.

#### Scenario: Level 1 Player
-   **Given** the player is Level 1
-   **When** an enemy spawns
-   **Then** the HP multiplier should be `1 + (1 * 0.05) = 1.05`
-   **And** the enemy HP should be `floor(BaseHP * 1.05)`

#### Scenario: Level 20 Player
-   **Given** the player is Level 20
-   **When** an enemy spawns
-   **Then** the HP multiplier should be `1 + (20 * 0.05) = 2.0`
-   **And** the enemy HP should be `floor(BaseHP * 2.0)`

### Requirement: Spawning Logic
The `EnemySpawner` MUST be responsible for calculating and passing the scaled stats.

#### Scenario: Spawning with Scaled Stats
-   **Given** the `EnemySpawner` is active
-   **When** it spawns a new enemy from the pool
-   **Then** it should calculate the scaled HP
-   **And** pass the new stats to the enemy's `spawn` method
-   **And** the enemy should initialize with the scaled HP

## API Changes
-   **Modified**: `Rattata.spawn(target, stats?)`
-   **Modified**: `Geodude.spawn(target, stats?)`
-   **Modified**: `Zubat.spawn(target, stats?)`
-   **Internal**: `EnemySpawner.spawnEnemy()` updates to use usage of stats injection.
