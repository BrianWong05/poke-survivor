## ADDED Requirements

### Requirement: Enemy Base HP
Enemies MUST have significantly increased Health Points (HP) to accommodate the new damage calculation logic and ensure proper game pacing.

#### Scenario: Rattata Durability
- **WHEN** a Rattata spawns
- **THEN** its Max HP MUST be at least **30**

#### Scenario: Geodude Durability
- **WHEN** a Geodude spawns
- **THEN** its Max HP MUST be at least **150** (significantly higher than Rattata)

#### Scenario: Zubat Durability
- **WHEN** a Zubat spawns
- **THEN** its Max HP MUST be at least **15** (lower than Rattata but higher than previous values)
