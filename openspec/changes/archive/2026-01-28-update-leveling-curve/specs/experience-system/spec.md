# experience-system Specifications

## MODIFIED Requirements

### Requirement: XP Curve Calculation
The experience required to reach the next level MUST follow a specific linear formula: `10 + (Level * 12)`.

#### Scenario: Calculating XP Cap
- **WHEN** the player is at a given level
- **THEN** the XP required for the NEXT level is `10 + (Level * 12)`
- **AND** for Level 1, the cap is 22
- **AND** for Level 2, the cap is 34
- **AND** for Level 10, the cap is 130
