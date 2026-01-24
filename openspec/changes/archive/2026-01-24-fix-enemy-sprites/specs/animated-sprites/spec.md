# animated-sprites Specification Delta

## ADDED Requirements

### Requirement: Enemy Directional Animation

Enemy sprites SHALL display the correct directional walking animation based on their movement direction toward the player.

#### Scenario: Enemy faces player while pursuing

Given an enemy is spawned and moving toward the player  
When the game loop updates the enemy's velocity  
Then the enemy's walk animation SHALL match its movement direction (down, up, left, right, or diagonals)

#### Scenario: Enemy updates direction when player moves

Given an enemy is pursuing the player  
When the player changes position  
Then the enemy's facing direction SHALL update to continue facing toward the new player position
