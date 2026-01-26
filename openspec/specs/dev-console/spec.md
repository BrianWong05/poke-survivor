# dev-console Specification

## Purpose
TBD - created by archiving change implement-dev-console. Update Purpose after archive.
## Requirements
### Requirement: Global Debug Access
The Game Scene MUST be accessible globally (e.g., via `window`) to allow external React components to manipulate game state directly.

#### Scenario: Accessing Global Scene
When a developer opens the browser console or the Dev Console component acts, it accesses `window.gameScene`. This property holds the active `MainScene` instance.

### Requirement: Debug Action - Level Up
The console MUST provide a mechanism to trigger an instant level up for the player.

#### Scenario: Clicking Level Up
When the user clicks the "Level Up" button in the debug console, the player character immediately gains enough experience to fill their current XP bar and trigger the level-up event/menu.

### Requirement: Debug Action - Full Heal
The console MUST provide a mechanism to fully heal the player character.

#### Scenario: Clicking Full Heal
When the user clicks the "Full Heal" button, the player's HP is restored to its maximum value immediately.

### Requirement: Debug Action - Kill All
The console MUST provide a mechanism to destroy all active enemies currently in the scene.

#### Scenario: Clicking Kill All
When the user clicks the "Kill All" button, all enemy entities currently active in the scene are destroyed or set to inactive, clearing the screen of threats.

### Requirement: Debug Action - Add Weapon
The console MUST allow the user to add and activate specific weapons (like OrbitWeapon variants) for testing purposes.

#### Scenario: Adding a Flame Wheel
When the user clicks "Add Flame Wheel", an instance of the `OrbitWeapon` configured as "Flame Wheel" is created. A timer or update loop is started to fire this weapon according to its cooldown, simulating it being equipped alongside the main weapon.

### Requirement: UI Overlay
The console MUST render as a toggleable overlay web component on top of the game canvas.

#### Scenario: Toggling Visibility
By default, the overlay is hidden. When the user presses the Backtick/Tilde key (`), the overlay becomes visible and the game loop (physics, time) MUST pause. The user MUST be able to manually resume the game loop while the overlay remains open (e.g., via a "Resume" button). Closing the overlay automatically resumes the game.

