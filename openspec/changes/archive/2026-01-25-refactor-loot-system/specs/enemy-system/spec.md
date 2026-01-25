# enemy-system Specification Delta

## ADDED Requirements

### Requirement: Enemy Tier Classification
Each enemy type SHALL be assigned a tier that determines its loot drop table.

#### Scenario: Enemy tier definitions
- **WHEN** `EnemyConfig` is imported
- **THEN** each enemy type includes a `tier` property from `EnemyTier` enum

#### Scenario: Existing enemy tier assignments
- **WHEN** enemies are spawned
- **THEN** the following tier mappings apply:
  - `Rattata` → `TIER_1`
  - `Geodude` → `TIER_2`
  - `Zubat` → `TIER_2`

---

### Requirement: EnemyTier Enum
The system SHALL define an `EnemyTier` enum for tier classification.

#### Scenario: EnemyTier values
- **WHEN** `EnemyTier` is imported
- **THEN** the following values are available:
  - `TIER_1`: Basic enemies (low HP, low reward)
  - `TIER_2`: Intermediate enemies (moderate HP, better reward chance)
  - `TIER_3`: Elite enemies (high HP, guaranteed better drops)
  - `TIER_4`: High Elite enemies (higher HP, mixed high rewards)
  - `TIER_5`: Mini-Boss enemies (very high HP, guaranteed high rewards)
  - `BOSS`: Boss enemies (very high HP, best drops)
