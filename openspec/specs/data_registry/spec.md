# data_registry Specification

## Purpose
TBD - created by archiving change add-dex-feature. Update Purpose after archive.
## Requirements
### Requirement: Centralized Game Metadata
The application MUST store metadata for all game entities in a central registry.

#### Scenario: Retrieving Enemy Data
Given the game is running
When I access `GameData.ENEMY_DEX`
Then I should see a list of all enemies including Rattata and Zubat with their stats and sprite paths.

#### Scenario: Retrieving Weapon Data
Given the game is running
When I access `GameData.WEAPON_DEX`
Then I should see a list of all weapons with their damage and type.

