## ADDED Requirements

### Requirement: Manual Level Setting
The Experience System SHALL expose a method to force a specific level or add levels instantly, bypassing XP collection.

#### Scenario: Force Level Set
- **WHEN** `setLevel(X)` is called
- **THEN** current level becomes X
- **THEN** XP to next level is recalculated for level X
- **THEN** current XP is reset to 0
