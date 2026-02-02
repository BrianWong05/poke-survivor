## Context

The game uses a **global player invulnerability** system where after taking any damage, the player becomes immune to all damage for 100ms. This is implemented in `Player.takeDamage()` via the `isInvulnerable` flag.

**Problem**: When 10 enemies collide with the player simultaneously, only 1 enemy deals damage. The other 9 are blocked by the invulnerability window. This makes swarm encounters trivial.

**Desired Behavior**: Each enemy should independently track when it last dealt damage. If 10 enemies touch the player, all 10 should deal damage (subject to their individual cooldowns).

## Goals / Non-Goals

**Goals:**
- Each enemy tracks its own attack cooldown (500ms between hits from the same enemy)
- Multiple distinct enemies can hit the player simultaneously
- Remove global player invulnerability that blocks all damage sources
- Minimal visual hit feedback (optional short 50ms window to prevent true instant-kill frame overlap)

**Non-Goals:**
- Changing damage calculation formulas (defense mitigation unchanged)
- Changing enemy AI or movement
- Adding new visual effects for enemy attacks

## Decisions

### Decision 1: 500ms Per-Enemy Cooldown
**Choice**: Use 500ms cooldown between attacks from the same enemy.
**Rationale**: 100ms is too short (feels like instant-kill in swarms), 1000ms is too forgiving. 500ms provides balance - same enemy can't rapid-fire, but swarms are still dangerous.
**Alternatives**: 
- 100ms (too punishing)
- 1000ms (too forgiving, swarms feel weak)

### Decision 2: Cooldown Reset in Enemy.init()
**Choice**: Reset `lastAttackTime = 0` when enemy is recycled from pool.
**Rationale**: Prevents stale timer state from previous lifecycle. A freshly spawned enemy should be able to attack immediately.

### Decision 3: Keep Minimal Visual Feedback
**Choice**: Keep a short 50ms alpha flicker on hit but **do NOT block damage**.
**Rationale**: Visual feedback helps player know they're being hit, but should not prevent further damage. The flicker is purely cosmetic.

## Risks / Trade-offs

- **Risk**: Player may feel overwhelmed by swarms dealing full damage.
  - **Mitigation**: 500ms cooldown still prevents same-enemy rapid-fire; defense stat still mitigates damage.
  
- **Risk**: Performance impact from checking time on every collision.
  - **Mitigation**: `this.time.now` is a simple property access, negligible overhead.
