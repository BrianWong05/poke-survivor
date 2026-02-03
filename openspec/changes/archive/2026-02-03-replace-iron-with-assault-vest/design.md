## Context

The 'Iron' item is visually confused with 'HP Up'. Both are pill-like sprites. 'Assault Vest' is a distinct Pokémon item (a tactical vest) that fits the 'Defense' theme.

## Goals / Non-Goals

**Goals:**
- Replace all visual and textual references of 'Iron' with 'Assault Vest'.
- Generate a new sprite for 'Assault Vest' that is visually distinct from 'HP Up'.
- Ensure gameplay mechanics (defense bonus) remain identical.

**Non-Goals:**
- Changing the defense calculation formula.
- Adding "Special Defense" as a separate stat (not supported by current engine).

## Decisions

- **Asset Generation**: Use `generate_image` to create a 32x32 pixel-art style tactical vest. This ensures visual distinction from the circular/pill-shaped 'HP Up'.
- **ID Change**: Change the internal ID from `iron` to `assault_vest`. This is cleaner than keeping the old ID for a new name.
- **Player.ts Update**: Update `recalculateStats` in `Player.ts` to look for `assault_vest` instead of `iron`.
- **File Renaming**: `Iron.ts` → `AssaultVest.ts`.

## Risks / Trade-offs

- **[Risk]** ID change might break saved games if persistence existed. → **Mitigation**: Current implementation doesn't seem to have cross-session persistence for mid-run items yet.
- **[Risk]** Sprite scale/style mismatch. → **Mitigation**: Use specific prompts for `generate_image` to match existing pixel art style.
