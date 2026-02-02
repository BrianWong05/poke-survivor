## 1. Enemy Attack Timer

- [x] 1.1 Add `lastAttackTime: number = 0` property to `Enemy.ts`
- [x] 1.2 Add `canAttack(time: number): boolean` method that returns `time > this.lastAttackTime + 500`
- [x] 1.3 Add `onAttack(time: number): void` method that sets `this.lastAttackTime = time`
- [x] 1.4 Reset `lastAttackTime = 0` in the `init()` method when enemy is recycled

## 2. Collision Handler Update

- [x] 2.1 Update `handlePlayerEnemyCollision` in `CombatManager.ts` to check `enemy.canAttack(currentTime)`
- [x] 2.2 Call `enemy.onAttack(currentTime)` after damage is applied
- [x] 2.3 Remove dependency on `player.isInvulnerable` check in the collision flow

## 3. Player Cleanup

- [x] 3.1 Remove global invulnerability blocking in `Player.takeDamage()` (keep visual feedback only)
- [x] 3.2 Optionally reduce or remove the `isInvulnerable` flag and `INVULNERABILITY_DURATION` constant

## 4. Verification

- [x] 4.1 Manual test: Spawn 5+ enemies, let them all touch the player at once, confirm player takes 5+ damage instances
- [x] 4.2 Manual test: Stand still with 1 enemy touching, confirm damage is applied every 500ms (not continuously)
