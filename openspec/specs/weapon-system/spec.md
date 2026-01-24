# weapon-system Specification

## Purpose
TBD - created by archiving change add-character-system. Update Purpose after archive.
## Requirements
### Requirement: Weapon Configuration
The system SHALL define weapons using a `WeaponConfig` interface with cooldown, fire behavior, and optional evolution.

#### Scenario: Weapon auto-fires on cooldown
- **WHEN** the weapon's cooldown timer elapses
- **THEN** the weapon's `fire()` function is called
- **AND** a projectile or effect is created based on weapon type

#### Scenario: Weapon with evolution
- **WHEN** a weapon has an `evolution` field
- **AND** the evolution condition is met
- **THEN** the weapon is replaced with its evolved version

---

### Requirement: Pikachu Weapon - Thunder Shock
The system SHALL implement Thunder Shock as Pikachu's base weapon.

#### Scenario: Thunder Shock fires
- **WHEN** Thunder Shock cooldown elapses
- **THEN** an electric projectile targets and homes toward the nearest enemy

---

### Requirement: Pikachu Weapon Evolution - Volt Tackle
The system SHALL implement Volt Tackle as the evolution of Thunder Shock.

#### Scenario: Volt Tackle execution
- **WHEN** Volt Tackle cooldown (2 seconds) elapses
- **THEN** Pikachu dashes forward invincibly
- **AND** an electric trail is left behind that damages enemies

---

### Requirement: Charizard Weapon - Flamethrower
The system SHALL implement Flamethrower as Charizard's base weapon.

#### Scenario: Flamethrower fires
- **WHEN** Flamethrower cooldown elapses
- **THEN** a cone of fire is emitted in the facing direction
- **AND** enemies in the cone take fire damage

---

### Requirement: Charizard Weapon Evolution - Blast Burn
The system SHALL implement Blast Burn as the evolution of Flamethrower.

#### Scenario: Blast Burn fires
- **WHEN** Blast Burn cooldown elapses
- **THEN** blue fire is emitted that pierces through enemies
- **AND** burning ground is left behind dealing damage over time

---

### Requirement: Blastoise Weapon - Water Pulse
The system SHALL implement Water Pulse as Blastoise's base weapon.

#### Scenario: Water Pulse fires
- **WHEN** Water Pulse cooldown elapses
- **THEN** an expanding ring of water is emitted from Blastoise
- **AND** enemies hit are pushed back (knockback effect)

---

### Requirement: Blastoise Weapon Evolution - Hydro Cannon
The system SHALL implement Hydro Cannon as the evolution of Water Pulse.

#### Scenario: Hydro Cannon fires
- **WHEN** Hydro Cannon cooldown elapses
- **THEN** two massive spiral water streams are fired
- **AND** a "no-go" zone is created where enemies cannot enter

---

### Requirement: Gengar Weapon - Lick
The system SHALL implement Lick as Gengar's base weapon.

#### Scenario: Lick attacks
- **WHEN** Lick cooldown elapses
- **THEN** a short-range attack is performed that ignores walls/terrain
- **AND** the "Curse" debuff is applied to hit enemies
- **AND** cursed enemies take increased damage from all sources

---

### Requirement: Gengar Weapon Evolution - Dream Eater
The system SHALL implement Dream Eater as the evolution of Lick.

#### Scenario: Dream Eater heals on cursed kill
- **WHEN** a cursed enemy is killed
- **THEN** Gengar heals 1 HP

---

### Requirement: Lucario Weapon - Aura Sphere
The system SHALL implement Aura Sphere as Lucario's base weapon.

#### Scenario: Aura Sphere fires
- **WHEN** Aura Sphere cooldown elapses
- **THEN** a homing orb is fired toward the nearest enemy
- **AND** the orb pierces through up to 2 enemies

---

### Requirement: Lucario Weapon Evolution - Focus Blast
The system SHALL implement Focus Blast as the evolution of Aura Sphere.

#### Scenario: Focus Blast fires
- **WHEN** Focus Blast cooldown elapses
- **THEN** a slower, larger orb is fired
- **AND** the orb explodes on impact
- **AND** critical hits instantly kill non-boss enemies

---

### Requirement: Snorlax Weapon - Body Slam
The system SHALL implement Body Slam as Snorlax's base weapon.

#### Scenario: Body Slam triggers
- **WHEN** 2 seconds have elapsed
- **THEN** a shockwave is emitted from Snorlax
- **AND** shockwave damage scales with Snorlax's max HP

---

### Requirement: Snorlax Weapon Evolution - Giga Impact
The system SHALL implement Giga Impact as the evolution of Body Slam.

#### Scenario: Giga Impact triggers
- **WHEN** Giga Impact cooldown elapses
- **THEN** a shockwave covering 80% of the screen is emitted
- **AND** enemies hit are stunned

---

### Requirement: Damage Type System
The system SHALL support damage types for projectiles and attacks.

#### Scenario: Projectile has damage type
- **WHEN** a projectile is created
- **THEN** it can optionally have a `damageType` (Normal, Fire, Ice, Electric, etc.)
- **AND** passives can modify damage based on type

