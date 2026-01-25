# experience-system Specification Delta

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Instant Level-Up Method
The `ExperienceManager` SHALL provide a method to grant an instant level-up.

#### Scenario: addInstantLevel called
- **WHEN** `addInstantLevel()` is called
- **THEN** `currentLevel` is incremented by 1
- **AND** `currentXP` is reset to 0
- **AND** `xpToNextLevel` is recalculated for the new level
- **AND** the method returns `true` to indicate level-up occurred
