## Context

The game lacks a straightforward offensive passive item. The Muscle Band will provide a linear scaling buff to the player's `might` stat.

## Goals / Non-Goals

**Goals:**
- Implement the Muscle Band passive item.
- Provide a +10% `might` buff per item level.
- Ensure the asset is loaded and correctly displayed in the UI.

**Non-Goals:**
- Implement complex scaling formulas (only linear +10% per level).
- Change how damage is calculated (rely on existing `might` usage).

## Decisions

- **Stat Application**: The `might` stat in `Player.ts` will be recalculated whenever an item is added or upgraded.
- **Asset**: Use the official sprite from PokeAPI.
- **Configuration**: Define `MUSCLE_BAND` in `ItemData.ts` or a new `PassiveData.ts` if appropriate.

## Risks / Trade-offs

- **Power Creep**: +50% total damage is significant. Mitigation: Limited passive slots and level cap of 5.
