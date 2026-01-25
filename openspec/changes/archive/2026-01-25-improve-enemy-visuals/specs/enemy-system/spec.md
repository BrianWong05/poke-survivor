# Enemy Juice Specification

## Purpose
Define the visual feedback and scale requirements for enemies to enhance game feel.

## MODIFIED Requirements

### Requirement: Enemy Base Class
The system SHALL provide a base `Enemy` class with enhanced visual feedback.

#### Scenario: Enemy initialization
- **MODIFIED**:
- **WHEN** an Enemy is created
- **THEN** the Enemy scale SHALL be set to **1.5**

#### Scenario: Enemy takes damage
- **MODIFIED**:
- **WHEN** `takeDamage(amount)` is called
- **THEN** the Enemy's `hp` is reduced by `amount`
- **AND** the Enemy SHALL flash solid white (`setTintFill(0xffffff)`) for 100ms
- **AND** the Enemy SHALL play an "Impact Pop" tween (squash and stretch)
