# Floating HP Bar Specification

## ADDED Requirements

### Requirement: Floating HP Bar Component
The system MUST provide a floating UI element that visualizes the target's health status.

#### Scenario: Creation
- GIVEN the game scene is active
- WHEN a `FloatingHpBar` is instantiated for a target
- THEN it creates a `Phaser.GameObjects.Graphics` object
- AND the dimensions are set to 50px width, 5px height.

#### Scenario: Visual Style
- GIVEN the HP bar is drawn
- THEN it renders a background rect (Black, 0.8 alpha)
- AND it renders a foreground rect (Red 0xFF0000) proportional to `current / max` HP.

#### Scenario: Following Target
- GIVEN the target moves
- WHEN `update()` is called
- THEN the HP bar position updates to `target.x - width/2` and `target.y + 25` (Below the player).

### Requirement: Player Integration
The Player entity MUST integrate the floating HP bar to display its current health.

#### Scenario: Taking Damage
- GIVEN the player has a floating HP bar
- WHEN the player takes damage
- THEN the bar immediately redraws to reflect the new HP %.

#### Scenario: Healing
- GIVEN the player heals
- THEN the bar immediately redraws to show increased HP.

#### Scenario: Max HP Change
- GIVEN the player gains Max HP (e.g. level up)
- THEN the bar redraws to adjust the ratio (visually might look same if full, but needs calculation update).

## REMOVED Requirements

### Requirement: Legacy UI
The legacy React HUD health display MUST be removed.

#### Scenario: HUD Cleanup
- GIVEN the game is running
- THEN the React HUD layer DOES NOT display an HP bar or HP text values.
