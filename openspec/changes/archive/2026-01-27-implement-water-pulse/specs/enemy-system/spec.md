# enemy-system

## ADDED Requirements

### Requirement: Knockback State
The `Enemy` class MUST support a state where movement AI is suspended.

#### Scenario: Apply Knockback
  - When `applyKnockback(force, duration)` is called
  - Then `isKnockedBack` becomes true.
  - And the enemy velocity is set to the force vector.
  - And a timer is started to reset `isKnockedBack` to false after `duration`.

#### Scenario: Movement Loop
  - When `update` (or `preUpdate`) runs
  - And `isKnockedBack` is true
  - Then standard movement logic (moving towards player) is skipped.
