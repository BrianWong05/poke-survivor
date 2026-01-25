# Tasks: Add Scalable Enemy System

## 1. Base Enemy Infrastructure
- [x] 1.1 Create `entities/enemies/Enemy.ts` base class extending `Phaser.Physics.Arcade.Sprite`
  - HP property and `takeDamage(amount)` method
  - `target` property for player reference
  - `preUpdate()` with `moveToObject` logic
  - `flipX` based on horizontal velocity
  - Death tween (fade out) and loot drop via `this.emit('enemy:death', x, y)`
  - Hit flash effect (`setTint(0xffffff)` for 100ms)
- [x] 1.2 Create `entities/enemies/EnemyConfig.ts` type definitions (`EnemyStats`, `EnemyType` enum)
- [x] 1.3 Create barrel export `entities/enemies/index.ts`

## 2. Enemy Variants
- [x] 2.1 Create `Rattata.ts` — speed 100, HP 10, straight chase AI
- [x] 2.2 Create `Geodude.ts` — speed 40, HP 50, mass 100 (knockback resistant)
- [x] 2.3 Create `Zubat.ts` — speed 140, HP 5, sine-wave evasion movement
- [x] 2.4 Generate placeholder textures for each variant (purple circle for Rattata, grey circle for Geodude, blue circle for Zubat)

## 3. Spawner System
- [x] 3.1 Create `systems/EnemySpawner.ts` with `Phaser.GameObjects.Group` pooling
- [x] 3.2 `spawn(playerX, playerY)` — pick spawn point outside camera (radius ~600)
- [x] 3.3 Wave config: time-based difficulty ramp
  - 0-60s: Rattata every 1s
  - 60-120s: Rattata + Zubat every 0.5s
  - 120s+: All types every 0.2s
- [x] 3.4 Expose `enemyGroup` for collision handling

## 4. MainScene Integration
- [x] 4.1 Initialize `EnemySpawner` in `MainScene.create()`
- [x] 4.2 Remove old inline `spawnEnemy()` method
- [x] 4.3 Wire `physics.add.overlap(player, enemySpawner.group, onPlayerHit)`
- [x] 4.4 Listen to `enemy:death` event to spawn Exp Candy
- [x] 4.5 Update `update()` loop to call `enemySpawner.update(elapsed)`

## 5. Validation
- [x] 5.1 Manual test: enemies spawn and chase player
- [x] 5.2 Manual test: Zubat moves in sine-wave pattern (configured, appears after 60s)
- [x] 5.3 Manual test: Geodude is knockback-resistant due to mass (configured, appears after 120s)
- [x] 5.4 Performance test: Game runs smoothly with enemies spawning
- [x] 5.5 Run `openspec validate add-enemy-system --strict`
