# Dex Manager Spec

## ADDED Requirements

### Requirement: Progression Tracking
The system MUST track which entities the player has "seen" and "unlocked".

#### Scenario: Encountering a new enemy
Given I have not seen 'pikachu' before
When I encounter 'pikachu' in the game
Then 'pikachu' should be marked as "seen" in the storage.

#### Scenario: Defeating an enemy
Given I have seen 'pikachu' but not unlocked it
When I defeat a 'pikachu'
Then 'pikachu' should be marked as "unlocked" in the storage.

### Requirement: Persistence
The system MUST persist discovery progress across sessions.

#### Scenario: Saving progress
Given I have unlocked 'charizard'
When I reload the game
Then 'charizard' should still be unlocked.
