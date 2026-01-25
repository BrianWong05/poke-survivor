# Design: Enemy Hit Juice

## Visual Feedback Loop
Satisfying combat relies on instant visual confirmation of impact.

### 1. Scale Increase (1.5x)
The current enemies feel small relative to the player. Increasing them to 1.5x fills the screen better and makes them feel more threatening.

### 2. Solid White Flash
Using `setTintFill` instead of `setTint` replaces the color entirely with white, which is the standard "hit" effect in retro/arcade games. It's much more visible than a color overlay.

### 3. Squash and Stretch
The "Impact Pop" uses classical animation principles. 
- **Squash (X)**: Simulates being hit from the side/center.
- **Stretch (Y)**: Simulates the energy pushing the enemy upwards/outwards.
- **Yoyo**: Ensures the enemy returns to its base 1.5 scale immediately.

```typescript
// Proposed implementation in takeDamage
const currentScale = 1.5;
this.scene.tweens.add({
  targets: this,
  scaleX: currentScale * 0.8,
  scaleY: currentScale * 1.2,
  duration: 50,
  yoyo: true,
  ease: 'Power2'
});
```
