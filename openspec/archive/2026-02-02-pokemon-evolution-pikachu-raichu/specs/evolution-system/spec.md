## ADDED Requirements

### Requirement: Decentralized Character Data
The system SHALL maintain character data (stats, evolution paths) in individual configuration files (e.g., `pikachu.ts`, `raichu.ts`) rather than a centralized database.

#### Scenario: Data retrieval
- **WHEN** the game requests character config
- **THEN** it SHALL return stats (Hp, Speed etc.) and optional `evolution` config from the specific file.

### Requirement: Automatic Evolution
The system SHALL attempt evolution automatically when a player levels up.

#### Scenario: Eligible for evolution
- **WHEN** player is 'pikachu' AND Level >= 20
- **THEN** evolution triggers to 'raichu' automatically (no chest required).

#### Scenario: Not eligible level
- **WHEN** player is 'pikachu' AND Level < 20
- **THEN** evolution does NOT trigger.

### Requirement: Evolution Application
The system SHALL apply visual and stat changes upon successful evolution.

#### Scenario: Successful evolution
- **WHEN** player evolves from 'pikachu' to 'raichu'
- **THEN** player texture updates to 'raichu'
- **AND** player stats (maxHp, might, defense) are updated to 'raichu' stats
- **AND** player speed is updated (e.g. 250 -> 280)
- **AND** player is fully healed
- **AND** a flash/scale tween plays
- **AND** "Evolved to Raichu!" log is displayed

### Requirement: Limit Break (Fallback)
The system SHALL apply a Limit Break stat boost if a character cannot evolve (fully evolved) at specific milestone levels.

#### Scenario: Limit Break trigger
- **WHEN** player is 'raichu' (or non-evolving) AND Level is 20 OR 40
- **THEN** player receives `Limit Break` stats (+5 HP, +5% Might, +0.5 Def)
- **AND** "LIMIT BREAK!" visual text is displayed.

#### Scenario: Non-milestone level
- **WHEN** player is 'raichu' AND Level is 30
- **THEN** no Limit Break occurs.
