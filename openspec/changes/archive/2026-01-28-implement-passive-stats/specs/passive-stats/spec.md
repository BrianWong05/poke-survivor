# Spec: Player Passive Stats

## ADDED Requirements

### Requirement: Player Health Regeneration
The player MUST automatically recover health over time if their `regen` stat is greater than zero.

#### Scenario: Regen Tick
Given the player has `regen` set to 5
And the player is missing health (Health < MaxHP)
When 1 second passes (1000ms)
Then the player should heal 5 HP
And the `health-change` event should be emitted

### Requirement: Player Defense
The player MUST take reduced damage based on their `defense` stat.

#### Scenario: Damage Reduction
Given the player has `defense` set to 2
When the player takes 10 damage
Then the player should only lose 8 HP (10 - 2)

#### Scenario: Minimum Damage
Given the player has `defense` set to 50
When the player takes 5 damage
Then the player should lose 1 HP (Damage cannot be reduced below 1)

### Requirement: Healing Mechanics
The player MUST be able to heal, capped at their maximum health.

#### Scenario: Healing Cap
Given the player has `maxHP` of 100
And the player has `health` of 95
When the player heals 10 HP
Then the player's health should be 100
