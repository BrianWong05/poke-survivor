# experience-system Specification

## Purpose
TBD - created by archiving change add-loot-and-leveling. Update Purpose after archive.
## Requirements
### Requirement: Exp Candy Tier Constants
The system SHALL define Exp Candy tiers with fixed XP values based on Pokémon game conventions.

#### Scenario: Exp Candy tier definitions
- **WHEN** the ExperienceManager is initialized
- **THEN** the following Exp Candy tiers are available:
  - EXP_CANDY_S: 1 XP (small, common drop)
  - EXP_CANDY_M: 10 XP (medium)
  - EXP_CANDY_L: 50 XP (large, rare)
  - EXP_CANDY_XL: 100 XP (extra large, very rare)
  - RARE_CANDY: 200 XP (boss-only drop, grants instant level progress)

---

### Requirement: XP Curve Calculation
The system SHALL calculate required XP for each level using a linear formula.

#### Scenario: Calculating XP for level progression
- **WHEN** `getRequiredXP(level)` is called
- **THEN** the result is `5 + (level * 10)`

#### Scenario: Level 1 progression
- **WHEN** player is at level 1
- **THEN** 15 XP is required to reach level 2

#### Scenario: Level 10 progression
- **WHEN** player is at level 10
- **THEN** 105 XP is required to reach level 11

---

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

