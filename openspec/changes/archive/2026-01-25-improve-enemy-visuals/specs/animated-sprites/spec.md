# Animation Speed Specification

## Purpose
Define the standard playback speed for sprite animations.

## ADDED Requirements

### Requirement: Animation Playback Speed
The system SHALL create animations with a standard playback rate to ensure consistent movement visuals.

#### Scenario: Standard playback rate
- **WHEN** animations are created in the Preloader
- **THEN** the `frameRate` SHALL be set to **12**
- **AND** this applies to both walk and idle animations
