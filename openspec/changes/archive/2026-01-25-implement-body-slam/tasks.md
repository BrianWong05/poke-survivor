# Tasks

1.  [ ] Create `Shockwave` entity class.
    *   Inherits `Phaser.Physics.Arcade.Sprite`.
    *   Implements scaling tween and alpha fade.
    *   Implements `hitList` logic.
2.  [ ] Implement `BodySlam` weapon class in `Specific/BodySlam.ts`.
    *   Define stats for Level 1-7.
    *   Define stats for Giga Impact (Level 8+).
    *   Implement `fire()` to spawn Shockwave.
3.  [ ] Register `BodySlam` in weapon registry (if applicable) or ensure `Snorlax` uses it.
4.  [ ] Verify "Infinite Pierce" and "Hit Once Per Pulse" logic.
5.  [ ] Verify "Stun" effect on Giga Impact.
