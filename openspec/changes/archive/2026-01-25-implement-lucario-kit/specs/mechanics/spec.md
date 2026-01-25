# Mechanics: Critical Hit & Instakill

## ADDED Requirements

### Requirement: Enemies MUST display critical hit visuals
The game MUST provide clear visual feedback when an enemy takes critical damage.

#### Scenario: Critical hit visual feedback
When `takeDamage` is called with `isCrit: true`, a floating text "CRIT!" MUST appear above the enemy in red color.

### Requirement: Critical hits MUST instakill non-boss enemies
Critical hits on standard enemies MUST result in immediate death to reward precision/luck.

#### Scenario: Instakill non-boss
When a standard enemy (non-boss) receives a critical hit, the enemy's HP MUST be set to 0 immediately.

### Requirement: Critical hits MUST deal double damage to bosses
Bosses MUST take increased damage from critical hits without instantly dying.

#### Scenario: Boss critical damage
When a Boss-type enemy receives a critical hit, the damage dealt MUST be 2x the original amount. The boss MUST NOT instantly die unless the damage is sufficient to reduce HP to 0.
