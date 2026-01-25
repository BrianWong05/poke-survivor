# weapon-lick Specification

## Purpose
TBD - created by archiving change implement-lick. Update Purpose after archive.
## Requirements
### Requirement: Lick Base Functionality
The Lick weapon MUST fire a short-range, instant tongue attack that damages and potentially paralyzes enemies.
#### Scenario: Basic Attack
- Given the player has the Lick weapon (Level 1-7)
- When the weapon fires
- Then a "TongueLash" projectile spawns at the player's position offset by 50px in the facing direction
- And it deals 15 damage to enemies hit
- And it has a 30% chance to apply Paralysis for 2000ms

#### Scenario: Visuals
- Given the Lick weapon fires
- Then a pink rectangle (0xFFC0CB) appears for 150ms
- And it rotates to match the player's rotation

### Requirement: Dream Eater Evolution
Upon reaching level 8, Lick MUST evolve into Dream Eater, gaining increased range, damage, and a life-steal mechanic against paralyzed targets.
#### Scenario: Upgrade to Level 8
- Given the player has Lick at Level 7
- When the player upgrades Lick
- Then it becomes "Dream Eater"

#### Scenario: Dream Eater Attack
- Given the player has Dream Eater
- When the weapon fires
- Then the projectile is purple (0x800080) and larger (200px range)
- And it deals 50 base damage

#### Scenario: Dream Eater Combo
- Given an enemy is hit by Dream Eater
- And the enemy is currently Paralyzed
- Then the enemy takes Double Damage (100 total)
- And the player Heals 2 HP (capped at 10 HP total healing per cast)

