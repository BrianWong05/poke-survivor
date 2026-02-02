## ADDED Requirements

### Requirement: Growth Multiplier
The Experience system SHALL apply a `growth` multiplier to all XP gains after diminishing returns are calculated.

#### Scenario: XP gain with growth multiplier 
- **WHEN** the player gains 100 base XP
- **AND** the `growth` multiplier is 1.2
- **THEN** the final XP gain SHALL be 120 (assuming multiplier 1.0 from diminishing returns)
