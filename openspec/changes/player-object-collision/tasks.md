## 1. Core Logic (MainScene)

- [x] 1.1 Update `MainScene.createCustomMap` to enable physics for the `objectsLayer` using `setCollisionByExclusion([-1])`.
- [x] 1.2 Add a physics collider between `this.player` and the `objectsLayer` in `MainScene.createCustomMap`.

## 2. Verification

- [ ] 2.1 Test in the game with a map containing objects to ensure the player is blocked.
- [ ] 2.2 Confirm that enemies and other entities are not negatively affected (they use separate collision logic usually, but worth checking).
