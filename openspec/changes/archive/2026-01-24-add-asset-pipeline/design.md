## Context

The poke-survivor game requires Pokémon sprite assets for visual presentation. Currently, the game uses programmatically generated shapes (circles, squares) as placeholders. This design describes an automated pipeline to download, process, and integrate PMD-style sprites.

### Stakeholders
- Developer: Needs repeatable asset pipeline
- Game: Needs consistent sprite sheets with frame metadata

### Constraints
- PMDCollab sprites are for non-commercial use only
- Sprites are organized in a specific format requiring XML parsing
- Frame sizes vary per Pokémon; normalization may be needed

---

## Goals / Non-Goals

### Goals
- Automate sprite download for configurable Pokémon IDs
- Extract Walk/Move animation frames and create horizontal sprite strips
- Generate manifest.json compatible with Phaser's spritesheet loader
- Allow easy addition of new Pokémon IDs

### Non-Goals
- Download all 1000+ Pokémon (only selected IDs)
- Support multiple animation types (Walk only for MVP)
- Real-time asset fetching at game runtime
- Handle shiny/form variations

---

## Decisions

### Data Source: PMDCollab SpriteServer API

**Decision**: Use PMDCollab SpriteServer API (`spriteserver.pmdcollab.org`).

**Rationale**:
- Official API endpoint for PMDCollab sprites
- Downloads single `sprites.zip` per Pokémon (faster than individual files)
- Includes AnimData.xml for frame metadata inside the zip
- All animations bundled together in one download
- Free for fangames with artist credit

**Alternatives Considered**:
1. **PokeAPI sprites**: Official but not PMD-style; GIF format needs conversion
2. **Veekun/Bulbapedia**: Different art style; complex scraping
3. **Custom placeholder graphics**: Current approach; not visually appealing

### Animation Frame Format

**Decision**: Keep full 8-direction grid sprite sheet PNG.

**Rationale**:
- Phaser's `load.spritesheet()` expects grid layout
- Single file per Pokémon simplifies loading
- All 8 directions available for movement-based animation
- Consistent with PMDCollab's native format

**Format**:
```
     Frame1  Frame2  Frame3  Frame4  ...
    ┌──────┬──────┬──────┬──────┐
Dir0│  F1  │  F2  │  F3  │  F4  │  ← Down
    ├──────┼──────┼──────┼──────┤
Dir1│  F1  │  F2  │  F3  │  F4  │  ← DownLeft
    ├──────┼──────┼──────┼──────┤
Dir2│  F1  │  F2  │  F3  │  F4  │  ← Left
    ├──────┼──────┼──────┼──────┤
... │ ...  │ ...  │ ...  │ ...  │  ← (8 rows total)
    └──────┴──────┴──────┴──────┘
```

### Manifest Schema

```json
{
  "id": "1",
  "name": "bulbasaur",
  "path": "assets/sprites/1.png",
  "frameWidth": 40,
  "frameHeight": 40,
  "frameCount": 6,
  "directions": 8
}
```

**Key fields**:
- `frameWidth`/`frameHeight`: For Phaser spritesheet slicing
- `frameCount`: Frames per direction
- `directions`: Number of direction rows (8 for full directional)
- `path`: Relative to public folder for browser loading

---

## Risks / Trade-offs

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PMDCollab structure changes | Low | Pin to specific commit or mirror |
| AnimData.xml parsing errors | Medium | Fallback to default frame dimensions |
| Some Pokémon missing Walk animation | Medium | Skip and log warning |
| Large sprite sheets (100+ frames) | Low | Extract only Walk frames |

---

## Technical Implementation

### PMDCollab URL Structure

```
Base URL: https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/

Sprite Sheet: sprite/{pokedex_number}/Anim-Front.png
Metadata:     sprite/{pokedex_number}/AnimData.xml
```

### AnimData.xml Structure (Example)

```xml
<AnimData>
  <ShadowSize>1</ShadowSize>
  <Anims>
    <Anim>
      <Name>Walk</Name>
      <Index>1</Index>
      <FrameWidth>48</FrameWidth>
      <FrameHeight>48</FrameHeight>
      <Durations>
        <Duration>4</Duration>
        <Duration>4</Duration>
        <Duration>4</Duration>
        <Duration>4</Duration>
      </Durations>
    </Anim>
    ...
  </Anims>
</AnimData>
```

### Algorithm

1. For each Pokémon ID:
   a. Download `AnimData.xml`
   b. Parse for `Walk` or `Move` animation
   c. Extract: frameWidth, frameHeight, frameCount (len of Durations)
   d. Download `Anim-Front.png`
   e. Locate Walk animation row (Index determines row position)
   f. Extract frames for first direction (front-facing)
   g. Stitch into horizontal strip
   h. Save as `{id}.png`

2. Build manifest.json array from collected metadata

### Phaser Integration

The sprites are now organized as grids with 8 rows (one per direction) and N columns (one per frame).

**Direction Order** (row index):
- 0: Down
- 1: DownLeft  
- 2: Left
- 3: UpLeft
- 4: Up
- 5: UpRight
- 6: Right
- 7: DownRight

#### Option 1: Create a Preloader Scene

Create a new file `src/game/scenes/Preloader.ts`:

```typescript
import Phaser from 'phaser';

interface SpriteManifestEntry {
  id: string;
  name: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;  // 8 for full directional, 1 for single
}

// Direction name mapping
const DIRECTION_NAMES = ['down', 'down-left', 'left', 'up-left', 'up', 'up-right', 'right', 'down-right'];

export class Preloader extends Phaser.Scene {
  private manifest: SpriteManifestEntry[] = [];

  constructor() {
    super({ key: 'Preloader' });
  }

  preload(): void {
    // Load manifest first as JSON
    this.load.json('manifest', 'assets/manifest.json');
  }

  create(): void {
    // Get manifest data
    this.manifest = this.cache.json.get('manifest') as SpriteManifestEntry[];
    
    // Start loading sprites
    this.loadSprites();
  }

  private loadSprites(): void {
    // Register load callbacks
    this.load.on('complete', () => {
      this.createAnimations();
      this.scene.start('MainScene');
    });

    // Queue all spritesheets
    for (const sprite of this.manifest) {
      this.load.spritesheet(sprite.name, sprite.path, {
        frameWidth: sprite.frameWidth,
        frameHeight: sprite.frameHeight,
      });
    }

    // Start loading
    this.load.start();
  }

  private createAnimations(): void {
    for (const sprite of this.manifest) {
      // Create animation for each direction
      for (let dir = 0; dir < sprite.directions; dir++) {
        const dirName = DIRECTION_NAMES[dir] || `dir${dir}`;
        const startFrame = dir * sprite.frameCount;
        const endFrame = startFrame + sprite.frameCount - 1;
        
        this.anims.create({
          key: `${sprite.name}-walk-${dirName}`,
          frames: this.anims.generateFrameNumbers(sprite.name, {
            start: startFrame,
            end: endFrame,
          }),
          frameRate: 8,
          repeat: -1,
        });
      }
    }
  }
}
```

#### Option 2: Modify MainScene Directly

Add the following to `MainScene.ts`:

```typescript
// In create() method, replace createTextures() with:
private async loadSpritesFromManifest(): Promise<void> {
  const response = await fetch('/assets/manifest.json');
  const manifest = await response.json();
  
  return new Promise((resolve) => {
    this.load.on('complete', () => {
      // Create animations after sprites load
      for (const sprite of manifest) {
        this.anims.create({
          key: `${sprite.name}-walk`,
          frames: this.anims.generateFrameNumbers(sprite.name, {
            start: 0,
            end: sprite.frameCount - 1,
          }),
          frameRate: 8,
          repeat: -1,
        });
      }
      resolve();
    });

    for (const sprite of manifest) {
      this.load.spritesheet(sprite.name, sprite.path, {
        frameWidth: sprite.frameWidth,
        frameHeight: sprite.frameHeight,
      });
    }
    
    this.load.start();
  });
}

// After player sprite is created:
this.player.play('pikachu-walk');
```

#### Using Sprites in Game

```typescript
// Direction constants matching sprite sheet order
const DIRECTIONS = {
  DOWN: 'down',
  DOWN_LEFT: 'down-left',
  LEFT: 'left',
  UP_LEFT: 'up-left',
  UP: 'up',
  UP_RIGHT: 'up-right',
  RIGHT: 'right',
  DOWN_RIGHT: 'down-right',
};

// Create a player with directional animations
this.player = this.physics.add.sprite(centerX, centerY, 'pikachu');
this.player.play('pikachu-walk-down');  // Start facing down

// Change direction based on movement
update() {
  const velocity = this.player.body.velocity;
  let direction = DIRECTIONS.DOWN;
  
  if (velocity.x > 0 && velocity.y > 0) direction = DIRECTIONS.DOWN_RIGHT;
  else if (velocity.x < 0 && velocity.y > 0) direction = DIRECTIONS.DOWN_LEFT;
  else if (velocity.x > 0 && velocity.y < 0) direction = DIRECTIONS.UP_RIGHT;
  else if (velocity.x < 0 && velocity.y < 0) direction = DIRECTIONS.UP_LEFT;
  else if (velocity.x > 0) direction = DIRECTIONS.RIGHT;
  else if (velocity.x < 0) direction = DIRECTIONS.LEFT;
  else if (velocity.y > 0) direction = DIRECTIONS.DOWN;
  else if (velocity.y < 0) direction = DIRECTIONS.UP;
  
  const animKey = `pikachu-walk-${direction}`;
  if (this.player.anims.currentAnim?.key !== animKey) {
    this.player.play(animKey);
  }
}

// Create enemies with random sprites
const enemyNames = ['bulbasaur', 'charmander', 'squirtle', 'eevee', 'mewtwo'];
const enemyName = Phaser.Math.RND.pick(enemyNames);
const enemy = this.enemies.get(x, y, enemyName);
enemy.play(`${enemyName}-walk-down`);
```


---

## Migration Plan

1. Run `pip install -r scripts/requirements.txt`
2. Run `python scripts/download_assets.py`
3. Verify `public/assets/sprites/*.png` files created
4. Verify `public/assets/manifest.json` updated
5. Update Phaser Preloader to use manifest-driven loading
6. Remove programmatic texture generation from MainScene

### Rollback
- Restore old manifest.json from git
- Revert Preloader changes
- Programmatic textures still work as fallback

---

## Open Questions

1. **Frame rate normalization**: Should all sprites use the same animation speed, or respect per-Pokémon durations from XML?
   - **Proposed**: Use consistent 8fps for simplicity

2. **Missing sprites**: What to do if a Pokémon has no Walk animation?
   - **Proposed**: Fall back to Idle animation, or skip with warning

3. **Sprite scale normalization**: PMD sprites vary in size (32-80px). Normalize all to same size?
   - **Proposed**: Keep original sizes; scale in Phaser at runtime
