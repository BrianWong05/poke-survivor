## Context

The user has reported that the map spawn point should be centered on the play screen at the start. Currently, the camera might not be perfectly centered or might drift to the center. The goal is to ensure an instant and precise centering of the camera on the player's spawn position.

## Goals / Non-Goals

**Goals:**
- Ensure the player spawns at the logical center of the map (if using default map) or the specified spawn point.
- Ensure the camera is instantly centered on the player when the scene starts, without visible panning or interpolation from (0,0).

**Non-Goals:**
- Changing the map size or generation logic beyond spawn positioning.
- Implementing a complex camera system beyond centering (e.g. shake, zoom).

## Decisions

- **Instant Camera Follow**: We will configure the camera to follow the player *without* lerp initially, or manually set `camera.scrollX/Y` to the correct values before enabling the smooth follow. This avoids the "swoop" effect from (0,0).
- **Consolidated Setup**: We will move the camera setup to a single location or ensure the sequence guarantees centering before the first render.

## Risks / Trade-offs

- **Risk**: If the player position is not yet finalized when we set the camera, it might snap to the wrong place.
  - **Mitigation**: Ensure camera setup happens after player physics body is positioned.
