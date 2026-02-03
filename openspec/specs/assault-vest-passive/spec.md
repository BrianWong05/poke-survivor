# assault-vest-passive Specification

## Purpose
The Assault Vest item increases the player's defense statistic, helping them survive longer in combat. It replaces the old 'Iron' item to avoid visual confusion with HP Up.

## Requirements

### Requirement: The Assault Vest Item MUST Increase Player Defense
The Assault Vest item MUST increase the player's defense statistic when acquired or upgraded.

#### Scenario: Acquiring Assault Vest Level 1
- **Given** the player has 0 defense
- **When** the player acquires "Assault Vest"
- **Then** the player's defense should increase by 1.

### Requirement: The Assault Vest Item Stats MUST Scale Linearly
The Assault Vest item MUST scale its defense bonus linearly with item level, adding 1 defense point per level.

#### Scenario: Upgrading to Level 2
- **Given** the player has Assault Vest Level 1 (Defense +1)
- **When** the player upgrades Assault Vest to Level 2
- **Then** the player's defense should increase by another 1 (Total +2).

#### Scenario: Upgrading to Level 5
- **Given** the player has Assault Vest Level 4 (Defense +4)
- **When** the player upgrades Assault Vest to Level 5
- **Then** the player's defense should increase by another 1 (Total +5).

### Requirement: The Assault Vest Item MUST Have Specific Metadata
The Assault Vest item MUST have specific metadata including name, description, texture, and tint.

#### Scenario: Checking Item Details
- **Given** the Assault Vest item instance
- **Then** its name should be "Assault Vest (突擊背心)"
- **And** its description should be "Increases defense by 1 per rank. Too similar to HP Up? Not anymore!"
- **And** its texture should be 'item_assault_vest'
- **And** its tint should be 0xFFFFFF (no tint needed for the actual sprite).
