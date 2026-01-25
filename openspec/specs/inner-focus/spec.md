# inner-focus Specification

## Purpose
TBD - created by archiving change implement-lucario-kit. Update Purpose after archive.
## Requirements
### Requirement: Character selection MUST apply modifiers
The selected character MUST apply its specific passive trait modifiers to the player stats.

#### Scenario: Projectile size modifier
When player selects Lucario or Riolu, Player's `projectileSizeModifier` MUST be set to 1.2.

### Requirement: Weapons MUST scale projectile size based on modifier
All projectile weapons MUST check the player's modifier to adjust their size.

#### Scenario: Scaling logic
When any projectile weapon fires a projectile, the projectile's scale MUST be multiplied by `player.projectileSizeModifier`.

