# animated-sprites Specification

## Purpose
TBD - created by archiving change idle-animations. Update Purpose after archive.
## Requirements
### Requirement: Idle Animation State
The game SHALL visually distinguish between moving and non-moving states by playing appropriate animations.

#### Scenario: Character stands still
Given the player character is not moving (velocity is 0)
When the game loop updates
Then the character should play the "idle" animation for the current direction

#### Scenario: Character starts moving
Given the player character is currently idle
When the player provides input to move
Then the character should instantly switch to the "walk" animation for the new direction

### Requirement: Asset Pipeline Idle Support
The asset pipeline MUST be capable of extracting and bundling "Idle" animations alongside the existing "Walk" animations.

#### Scenario: Animation asset availability
Given a Pokémon entity is loaded
When the asset pipeline processes the entity
Then it should attempt to extract both "Walk" and "Idle" animations from the source
And make them available to the game engine

#### Scenario: Fallback behavior
Given an entity does not have an "Idle" animation in the source
When the game requests the "idle" animation
Then it should fallback to the first frame of the "walk" animation (or pause the walk animation)
<!-- Notes: This fallback might be handled by duplicating the walk frame as idle in the pipeline, or by game logic. The pipeline approach is preferred for consistency. -->

