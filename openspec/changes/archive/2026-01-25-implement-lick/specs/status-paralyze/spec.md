# Paralysis Status Spec

## ADDED Requirements

### Paralysis Logic
### Requirement: Paralysis Mechanics
Paralysis is a status effect that MUST temporarily stop an enemy's movement and change their color.
#### Scenario: Apply Paralysis
- Given an enemy is moving normally
- When the enemy is Paralyzed for X duration
- Then its speed becomes 0
- And its color tint becomes Yellow (0xFFFF00)
- And `isParalyzed` is true

#### Scenario: Paralysis Wear-off
- Given an enemy is Paralyzed
- When the duration X expires
- Then its speed returns to its original value
- And the yellow tint is removed
- And `isParalyzed` is false
