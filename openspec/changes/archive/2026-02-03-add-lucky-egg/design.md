## Context

The player progression system uses experience points (XP) gathered from gems. Currently, XP gain is only modified by level-based diminishing returns. This design introduces a player-controlled multiplier via the Lucky Egg passive item.

## Goals / Non-Goals

**Goals:**
- Implement Lucky Egg passive item with 5 levels.
- Apply a +10% XP gain multiplier per item level.
- Ensure visual representation with the correct sprite.

**Non-Goals:**
- Modifying the core XP required per level formula.
- Implementing other XP-modifying items in this change.

## Decisions

### 1. Growth Stat Integration
We will add a `growth` property to the `Player` class, initialized to 1.0. This follows the existing pattern for stats like `might` or `haste`.

### 2. Additive Level Scaling
The growth boost will be calculated as `0.10 * level`. For a Level 5 Lucky Egg, the player's `growth` stat will be `1.5` (1.0 base + 0.5 boost).

### 3. XP Gain Interception
The `gainExperience` method in `Player.ts` will multiply the incoming `amount` by `this.growth`. This ensures all sources of XP (gems, rewards, etc.) benefit from the boost.

## Risks / Trade-offs

- **[Risk] Float Precision**: Multiplying small XP amounts by 1.1 might lead to rounding issues.
- **[Mitigation]**: Ensure `this.experience` can handle floats or use `Math.ceil`/`Math.round` appropriately. However, the requirement suggests simple multiplication.
