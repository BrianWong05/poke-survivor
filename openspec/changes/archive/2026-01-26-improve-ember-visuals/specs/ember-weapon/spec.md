# ember-weapon Specification

## MODIFIED Requirements

### Requirement: Fireball Projectile
The system SHALL support a `Fireball` projectile with appropriate visuals.

#### Scenario: Fireball Creation
- **MODIFIED**:
- **WHEN** a Fireball is spawned
- **THEN** it SHALL render as a flame-shaped sprite (not a simple circle)
- **AND** it SHALL have an inner core (Yellow) and outer edge (Orange/Red)
- **AND** it moves at a constant speed (400)
