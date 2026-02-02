# damage-logic Specification

## Purpose
Standardize damage calculation logic for weapons and implement visual feedback system for damage events.

## Requirements

### Requirement: Weapon Damage Calculation
The system SHALL calculate outgoing weapon damage using the formula `(WeaponBase + PlayerBase) * PlayerMight`.

#### Scenario: Basic Damage Calculation
- **WHEN** a weapon with 10 damage is fired by a player with 5 base damage and 1.5 might
- **THEN** the final damage should be 22.5 ((10 + 5) * 1.5)

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

### Requirement: New Damage Formula MUST Allow Fractional Damage
The damage calculation MUST allow mitigated damage to fall below 1, using the formula `final = amount * (1 / (1 + defense * 0.1))`.

The player's `takeDamage` method MUST NOT set a global blocking flag that prevents subsequent damage within a time window. Each call to `takeDamage` MUST apply damage independently.

#### Scenario: Low Damage vs High Defense
- **Given** an enemy deals 1 damage
- **And** the player has 10 Defense
- **When** the player takes damage
- **Then** the mitigation factor should be 0.5 (1 / (1 + 1))
- **And** the final damage taken should be 0.5.

#### Scenario: High Damage vs Low Defense
- **Given** an enemy deals 10 damage
- **And** the player has 10 Defense
- **When** the player takes damage
- **Then** the mitigation factor should be 0.5
- **And** the final damage taken should be 5 (10 * 0.5).

#### Scenario: High Damage vs High Defense
- **Given** an enemy deals 100 damage
- **And** the player has 90 Defense
- **When** the player takes damage
- **Then** the mitigation factor should be 0.1 (1 / (1 + 9))
- **And** the final damage taken should be 10.

#### Scenario: Fractional Health Tracking
- **Given** the player takes 0.5 damage
- **When** the hp-update event is emitted
- **Then** the value should be rounded up (Math.ceil) to the nearest integer.

#### Scenario: Multiple Damage Sources Not Globally Blocked
- **Given** the player just took damage from Enemy A
- **When** takeDamage is called again from Enemy B within 100ms
- **Then** the damage from Enemy B MUST be applied (no global invulnerability)


