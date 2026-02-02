## ADDED Requirements

### Requirement: Weapon Damage Calculation
The system SHALL calculate outgoing weapon damage using the formula `(WeaponBase + PlayerBase) * PlayerMight`.

#### Scenario: Basic Damage Calculation
- **WHEN** a weapon with 10 damage is fired by a player with 5 base damage and 1.5 might
- **THEN** the final damage should be 22.5 ((10 + 5) * 1.5)

#### Scenario: Zero Base Damage
- **WHEN** a weapon with 10 damage is fired by a player with 0 base damage and 1.0 might
- **THEN** the final damage should be 10

#### Scenario: Zero Might
- **WHEN** a weapon with 10 damage is fired by a player with 10 base damage and 0 might
- **THEN** the final damage should be 0

### Requirement: Damage Variance
The system SHALL apply a random variance of ±15% to the calculated outgoing damage.
Formula: `Final = ROUND(RawDamage * (0.85 + (Random * 0.30)))`

#### Scenario: Variance Limits
- **WHEN** calculating damage
- **THEN** the result MUST be within 85% and 115% of the raw damage
- **AND** the result MUST be an integer (rounded)

### Requirement: Visual Damage Feedback
The system SHALL display floating text indicating the amount of damage taken by an enemy.

#### Scenario: Floating Text Display
- **WHEN** an enemy takes damage
- **THEN** a floating text object displaying the damage amount SHALL appear at the enemy's position
- **AND** it SHALL float upwards and fade out before being destroyed
