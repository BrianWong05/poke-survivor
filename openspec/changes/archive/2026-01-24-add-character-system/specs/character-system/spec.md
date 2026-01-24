## ADDED Requirements

### Requirement: Character Configuration
The system SHALL define characters using a `CharacterConfig` interface that includes stats, passive, weapon, and ultimate configurations.

#### Scenario: Loading a character configuration
- **WHEN** the game initializes with a selected character ID
- **THEN** the corresponding `CharacterConfig` is loaded from the registry
- **AND** the player sprite, stats, passive, weapon, and ultimate are initialized from the config

#### Scenario: Character stats applied to player
- **WHEN** a character is loaded
- **THEN** the player's `maxHP`, `speed`, and `baseDamage` are set from `CharacterStats`

---

### Requirement: Character Registry
The system SHALL maintain a registry of all available character configurations.

#### Scenario: Registry contains all characters
- **WHEN** the registry is queried
- **THEN** it returns configurations for: Pikachu, Charizard, Blastoise, Gengar, Lucario, Snorlax

#### Scenario: Get character by ID
- **WHEN** a character ID is provided to `getCharacter(id)`
- **THEN** the matching `CharacterConfig` is returned
- **OR** an error is thrown if the ID is not found

---

### Requirement: Passive Ability System
The system SHALL apply a character's passive ability when the character is loaded.

#### Scenario: Pikachu Static passive
- **WHEN** an enemy touches Pikachu
- **THEN** there is a 30% chance the enemy is stunned for 0.5 seconds

#### Scenario: Charizard Blaze passive
- **WHEN** Charizard is below max HP
- **THEN** damage is increased by 1% for every 1% HP missing

#### Scenario: Blastoise Rain Dish passive
- **WHEN** 5 seconds have elapsed
- **THEN** Blastoise regenerates 1 HP (up to max HP)

#### Scenario: Gengar Levitate passive
- **WHEN** Gengar moves through terrain or slow zones
- **THEN** movement speed is not reduced

#### Scenario: Lucario Inner Focus passive
- **WHEN** Lucario is active
- **THEN** projectile size is increased by 20%
- **AND** Lucario is immune to flinch and stun effects

#### Scenario: Snorlax Thick Fat passive
- **WHEN** Snorlax takes damage from Fire or Ice type attacks
- **THEN** damage is reduced by 50%

---

### Requirement: Ultimate Ability System
The system SHALL allow players to manually trigger their character's ultimate ability.

#### Scenario: Ultimate trigger via input
- **WHEN** the player presses the Ultimate key (Space or designated button)
- **AND** the ultimate cooldown has elapsed
- **THEN** the character's ultimate ability is executed
- **AND** the cooldown timer resets

#### Scenario: Ultimate on cooldown
- **WHEN** the player presses the Ultimate key
- **AND** the ultimate is still on cooldown
- **THEN** nothing happens
- **AND** the remaining cooldown is displayed

---

### Requirement: Pikachu Ultimate - Gigantamax Thunder
The system SHALL implement Pikachu's Gigantamax Thunder ultimate.

#### Scenario: Gigantamax Thunder execution
- **WHEN** Pikachu's ultimate is triggered
- **THEN** all enemies on screen are stunned
- **AND** massive damage is dealt to enemies in the immediate area
- **AND** a visual lightning effect covers the screen

---

### Requirement: Charizard Ultimate - Seismic Toss
The system SHALL implement Charizard's Seismic Toss ultimate.

#### Scenario: Seismic Toss execution
- **WHEN** Charizard's ultimate is triggered
- **THEN** Charizard flies upward and becomes invincible for 5 seconds
- **AND** fireballs rain down on the play area during flight
- **THEN** Charizard slams down dealing screen-wide damage

---

### Requirement: Blastoise Ultimate - Shell Smash
The system SHALL implement Blastoise's Shell Smash ultimate.

#### Scenario: Shell Smash execution
- **WHEN** Blastoise's ultimate is triggered
- **THEN** Blastoise retracts into shell for 10 seconds
- **AND** bounces off screen edges with pinball physics
- **AND** crushes enemies on contact
- **AND** player cannot control movement during this time

---

### Requirement: Gengar Ultimate - Destiny Bond
The system SHALL implement Gengar's Destiny Bond ultimate.

#### Scenario: Destiny Bond execution
- **WHEN** Gengar's ultimate is triggered
- **THEN** all visible enemies are linked to Gengar for 5 seconds
- **AND** any damage Gengar takes is reflected to linked enemies at 500% magnitude

---

### Requirement: Lucario Ultimate - Bone Rush
The system SHALL implement Lucario's Bone Rush ultimate.

#### Scenario: Bone Rush execution
- **WHEN** Lucario's ultimate is triggered
- **THEN** energy bones orbit rapidly around Lucario for 8 seconds
- **AND** movement speed is increased by 50%
- **AND** orbiting bones damage enemies on contact

---

### Requirement: Snorlax Ultimate - Rest
The system SHALL implement Snorlax's Rest ultimate.

#### Scenario: Rest execution
- **WHEN** Snorlax's ultimate is triggered
- **THEN** Snorlax falls asleep for 3 seconds
- **AND** Snorlax is invulnerable and cannot move during sleep
- **AND** HP is fully restored
- **THEN** upon waking, an AOE damage burst is triggered
