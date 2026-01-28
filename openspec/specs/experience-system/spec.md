# experience-system Specification

## Purpose
TBD - created by archiving change add-loot-and-leveling. Update Purpose after archive.
## Requirements
### Requirement: Exp Candy Tier Constants
The system SHALL use updated XP values aligned with tier-based loot.

#### Scenario: Exp Candy tier definitions (MODIFIED)
- **WHEN** the ExperienceManager is initialized
- **THEN** the following Exp Candy tiers are available:
  - `EXP_CANDY_S`: 1 XP (small, Tier 1 drop)
  - `EXP_CANDY_M`: 10 XP (medium, Tier 2-3 drop)
  - `EXP_CANDY_L`: 100 XP (large, Boss drop)
  - `RARE_CANDY`: Instant level-up (Boss-only, 5% chance)

> **Note**: `EXP_CANDY_XL` tier is REMOVED and consolidated into `EXP_CANDY_L`.

---

### Requirement: XP Curve Calculation
The experience required to reach the next level MUST follow a specific linear formula: `10 + (Level * 12)`.

#### Scenario: Calculating XP Cap
- **WHEN** the player is at a given level
- **THEN** the XP required for the NEXT level is `10 + (Level * 12)`
- **AND** for Level 1, the cap is 22
- **AND** for Level 2, the cap is 34
- **AND** for Level 10, the cap is 130

### Requirement: Diminishing Returns
The system SHALL apply a multiplier to XP gains based on player level.

#### Scenario: Full XP at low levels
- **WHEN** `calculateGain(amount, level)` is called
- **AND** level is between 1 and 19
- **THEN** the multiplier is 1.0 (full XP)

#### Scenario: Reduced XP at mid levels
- **WHEN** `calculateGain(amount, level)` is called
- **AND** level is between 20 and 39
- **THEN** the multiplier is 0.75

#### Scenario: Half XP at high levels
- **WHEN** `calculateGain(amount, level)` is called
- **AND** level is between 40 and 59
- **THEN** the multiplier is 0.50

#### Scenario: Quarter XP at very high levels
- **WHEN** `calculateGain(amount, level)` is called
- **AND** level is 60 or above
- **THEN** the multiplier is 0.25

---

### Requirement: Level Up Detection
The ExperienceManager `addXP` method SHALL return a boolean indicating whether a level-up occurred.

#### Scenario: XP added without level up
- **WHEN** `addXP(amount)` is called
- **AND** `currentXP + adjustedAmount < xpToNextLevel`
- **THEN** `false` is returned
- **AND** `currentXP` is increased by the adjusted amount

#### Scenario: XP added with level up
- **WHEN** `addXP(amount)` is called
- **AND** `currentXP + adjustedAmount >= xpToNextLevel`
- **THEN** `true` is returned
- **AND** `currentLevel` is incremented
- **AND** `xpToNextLevel` is recalculated for the new level
- **AND** excess XP carries over to the new level

---

### Requirement: ExperienceManager State
The ExperienceManager SHALL maintain mutable state for tracking player progression.

#### Scenario: State initialization
- **WHEN** an ExperienceManager is instantiated
- **THEN** `currentLevel` defaults to 1
- **AND** `currentXP` defaults to 0
- **AND** `xpToNextLevel` is calculated for level 2

### Requirement: Instant Level-Up Method
The `ExperienceManager` SHALL provide a method to grant an instant level-up.

#### Scenario: addInstantLevel called
- **WHEN** `addInstantLevel()` is called
- **THEN** `currentLevel` is incremented by 1
- **AND** `currentXP` is reset to 0
- **AND** `xpToNextLevel` is recalculated for the new level
- **AND** the method returns `true` to indicate level-up occurred

