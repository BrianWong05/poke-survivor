# Idle Animations Design

## Asset Pipeline Changes (`scripts/download_assets.py`)

Current behavior:
- Downloads `sprites.zip`, finds "Walk" (or fallback), extracts it to `{id}.png`.
- Manifest entry is flat: `path` to single PNG.

New behavior:
- Iterate through desired animation types: `["walk", "idle"]`.
- For each type found in `AnimData.xml`, extract to `{id}-{anim}.png` (e.g., `25-walk.png`, `25-idle.png`).
- Update `SpriteInfo` to hold a list or dict of animations.
- Update `manifest.json` structure.

## Manifest Schema Update

**Old:**
```typescript
interface SpriteManifestEntry {
  id: string;
  name: string;
  path: string;       // single image
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;
}
```

**New:**
```typescript
interface SpriteAnimation {
  key: string;        // 'walk', 'idle'
  path: string;       // 'assets/sprites/25-walk.png'
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;
}

interface SpriteManifestEntry {
  id: string;
  name: string;
  animations: SpriteAnimation[];
}
```

## Game Logic Changes

### `Preloader.ts`
- Adapt to new `SpriteManifestEntry` structure.
- Iterate over `sprite.animations`.
- Load each sprite sheet.
- Create Phaser animations with keys: `{spriteName}-{animKey}-{direction}` (e.g., `pikachu-idle-down`).
- Maintain existing `getDirectionFromVelocity` logic.

### `MainScene.ts`
- In `update()`:
  - Check velocity.
  - If moving (`vel != 0`), play `walk`.
  - If stopped (`vel == 0`), play `idle`.
- State tracking: `currentAnimState: 'walk' | 'idle'`.
- Only `play()` if state or direction changes to avoid resetting animation on every frame.
