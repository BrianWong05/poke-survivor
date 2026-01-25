# Proposal: Improve Enemy Visuals and Game Feel

**Goal**: Enhance the game's feedback loop by making enemies larger and adding satisfying visual reactions when they take damage.

## Capabilities

### 1. Enlarge Enemies
Increase the scale of all enemies to improve visibility and presence on the screen.
- Scale set to **1.5** in the `Enemy` base class.

### 2. Hit Reaction Juice
Implement a "Damage Feedback" loop that triggers upon calling `takeDamage`.
- **White Flash**: Use `setTintFill(0xffffff)` for a solid white flash (more intense than `setTint`).
- **Impact Pop**: A rapid squish-and-stretch tween (50ms yoyo) to simulate physical impact.

## Architecture
- **Base Class**: Modification to `src/game/entities/enemies/Enemy.ts` to implement the scale and hit logic.
- **Weapon Integration**: No changes needed to weapons; they already call `takeDamage`.
- **Performance**: Tweens are lightweight, but we will ensure they are only created when `active`.
