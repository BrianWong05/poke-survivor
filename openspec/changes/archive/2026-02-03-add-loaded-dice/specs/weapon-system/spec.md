## MODIFIED Requirements

### Requirement: Weapon Firing logic
The system SHALL support firing multiple projectiles based on the player's `amount` stat.

#### Scenario: Multi-projectile spread
- **WHEN** a weapon fires and the player has `amount > 0`
- **THEN** multiple projectiles should be spawned
- **AND** they should be distributed with a spread offset of 15 degrees around the aim angle

#### Scenario: Orbital Weapon refresh
- **WHEN** an orbital weapon (e.g. Aqua Ring) is active
- **AND** the player's `amount` stat changes
- **THEN** the orbital weapon should update its projectile count to (Base + Amount)
- **AND** ideally refresh immediately or on next update tick
