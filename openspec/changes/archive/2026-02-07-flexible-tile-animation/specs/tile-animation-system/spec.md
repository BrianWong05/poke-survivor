## ADDED Requirements

### Requirement: Independent Animation Loops
The `TileAnimator` must support multiple animations running with independent timers and speeds.
#### Scenario: Different Speeds
- **WHEN** Animation A has duration 100ms and Animation B has duration 200ms
- **THEN** Animation A updates twice as often as Animation B.

### Requirement: Frame Wrapping
Animations must loop back to the start frame after the last frame.
#### Scenario: End of Loop
- **WHEN** An animation with 3 frames (Ids: 10, 11, 12) is at frame 12
- **THEN** The next update sets the tile to frame 10.

### Requirement: Layer Integration
The system must update tiles on specific tilemap layers.
#### Scenario: Update Call
- **WHEN** `update` is called and an animation triggers
- **THEN** The specified layer is scanned, and matching tiles are updated.
