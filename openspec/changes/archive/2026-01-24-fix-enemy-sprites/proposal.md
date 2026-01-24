# Fix Enemy Sprite Facing Direction

## Why

When enemy Pokémon walk towards the player, they always display the "walk-down" animation regardless of their actual movement direction. This breaks visual feedback and makes enemies look unnatural.

### Visual Evidence

![Enemy facing down despite walking right](file:///Users/brianwong/.gemini/antigravity/brain/982949fb-464e-4b83-a3da-3ee83c655142/uploaded_media_0_1769256985709.png)

The sprite sheet contains 8 directional walking animations, but only "down" is being used:

![Sprite sheet with 8 directions](file:///Users/brianwong/.gemini/antigravity/brain/982949fb-464e-4b83-a3da-3ee83c655142/uploaded_media_1_1769256985709.png)

## Root Cause

In [MainScene.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/scenes/MainScene.ts):

1. **Spawn always uses `walk-down`** (line 341):
   ```typescript
   enemy.play(`${textureName}-walk-down`);
   ```

2. **Update loop sets velocity but ignores animation** (lines 488-505):
   ```typescript
   this.enemies.getChildren().forEach((child) => {
     const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
     enemy.setVelocity(Math.cos(angle) * enemySpeed, Math.sin(angle) * enemySpeed);
     // Missing: update animation based on velocity direction
   });
   ```

## Proposed Solution

Reuse the existing `getDirectionFromVelocity()` helper function to update enemy animations each frame in the `update()` loop, matching the same pattern used for the player character.

## What Changes

### MainScene

#### [MODIFY] [MainScene.ts](file:///Users/brianwong/Project/react/poke-survivor/src/game/scenes/MainScene.ts)

1. **In `update()` loop** – after setting enemy velocity, calculate direction and play the appropriate directional walk animation:
   ```diff
   +const vx = Math.cos(angle) * enemySpeed;
   +const vy = Math.sin(angle) * enemySpeed;
   +enemy.setVelocity(vx, vy);
   +
   +// Update animation to face player
   +if (!this.usePlaceholderGraphics && enemy.texture.key !== 'enemy') {
   +  const direction = getDirectionFromVelocity(vx, vy);
   +  const animKey = `${enemy.texture.key}-walk-${direction}`;
   +  enemy.play(animKey, true); // true = ignoreIfPlaying
   +}
   ```

2. **Optionally** – the spawn logic can also compute initial direction toward player instead of defaulting to down, but this is lower priority since the update loop will immediately correct it.

## Verification Plan

### Manual Browser Testing

1. Run `npm run dev` in the project root
2. Open `http://localhost:5173` in a browser
3. Observe enemies spawning from edges and walking towards the player
4. **Expected**: Enemies should face the direction they are walking (toward the player)
5. Move the player around and verify enemies continuously update their facing direction

