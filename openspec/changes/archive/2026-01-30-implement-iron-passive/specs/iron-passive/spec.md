# Spec: Iron Passive Item

## ADDED Requirements

### Requirement: The Iron Item MUST Increase Player Defense
The Iron item MUST increase the player's defense statistic when acquired or upgraded.
#### Scenario: Acquiring Iron Level 1
- **Given** the player has 0 defense
- **When** the player acquires "Iron"
- **Then** the player's defense should increase by 1.

### Requirement: The Iron Item Stats MUST Scale Linearly
The Iron item MUST scale its defense bonus linearly with item level, adding 1 defense point per level.
#### Scenario: Upgrading to Level 2
- **Given** the player has Iron Level 1 (Defense +1)
- **When** the player upgrades Iron to Level 2
- **Then** the player's defense should increase by another 1 (Total +2).

#### Scenario: Upgrading to Level 5
- **Given** the player has Iron Level 4 (Defense +4)
- **When** the player upgrades Iron to Level 5
- **Then** the player's defense should increase by another 1 (Total +5).

### Requirement: The Iron Item MUST Have Specific Metadata
The Iron item MUST have specific metadata including name, description, texture, and tint.
#### Scenario: Checking Item Details
- **Given** the Iron item instance
- **Then** its name should be "Iron (防禦增強劑)"
- **And** its description should be "Reduces incoming damage by 1 per rank."
- **And** its texture should be 'item_iron'
- **And** its tint should be 0xC0C0C0.
