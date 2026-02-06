## Context

Currently, several animated environmental tiles are stored in `src/assets/Autotiles/`. These assets are actually animation strips (128x32 or 256x32) rather than 3x4 autotile sets (96x128). This prevents them from being used correctly in the game and editor.

## Goals / Non-Goals

**Goals:**
- Relocate 7 animation assets to the correct directory.
- Register these animations in the central `TILE_ANIMATIONS` config.
- Enable their use in the Level Editor.

**Non-Goals:**
- Converting static autotiles into animated versions (only moving existing strips).
- Modifying the `TileAnimator` logic.

## Decisions

### 1. Asset Relocation
Move the following from `src/assets/Autotiles/` to `src/assets/Animations/`:
- `Black.png`
- `Seaweed dark.png`
- `Seaweed light.png`
- `Water current east.png`
- `Water current north.png`
- `Water current south.png`
- `Water current west.png`

### 2. Configuration Parameters
Add to `src/game/config/TileAnimations.ts`:
| Asset Name | Frame Count | Duration (ms) |
|------------|-------------|---------------|
| `Black.png` | 4 | 250 |
| `Seaweed dark.png` | 4 | 250 |
| `Seaweed light.png` | 4 | 250 |
| `Water current east.png` | 8 | 150 |
| `Water current north.png` | 8 | 150 |
| `Water current south.png` | 8 | 150 |
| `Water current west.png` | 8 | 150 |

*Rationale:* Frame counts were determined by image dimensions (Width / 32). Durations are chosen to match existing environmental animations (Flowers=250ms, Waterfall=150ms).

## Risks / Trade-offs

- **[Risk] Broken Map References** → Any maps currently trying to use these as autotiles will have broken references.
  - *Mitigation:* These assets were likely unusable as autotiles anyway due to dimension mismatch. We will verify the Level Editor can now place them correctly as animations.
- **[Risk] Performance** → Adding 7 more animations to scan.
  - *Mitigation:* `TileAnimator` only scans layers when a frame updates. Environmental animations have relatively high durations (150-250ms), minimizing per-frame overhead.
