# Proposal: Implement Gastly's Lick Weapon

## Goal
Implement Gastly's innate weapon, **Lick**, based on the "Whip" archetype but without knockback. It features a directional hitbox (front, then front+back at higher levels) and a paralysis chance.

## Requirements

### Weapon Stats Progression
- **Lvl 1:** Dmg 15, Count 1, Area 1.0, Duration 150ms, Cooldown 1000ms.
- **Lvl 2:** **Damage 20** (+5).
- **Lvl 3:** **Area 1.25** (+25%).
- **Lvl 4:** **Count 2** (Front & Back).
- **Lvl 5:** **Damage 25** (+5).
- **Lvl 6:** **Area 1.5** (+25%).
- **Lvl 7:** **Damage 35** (+10).
- **Lvl 8:** **Paralysis Chance 0.3** (30%).

### firing Logic
- Check `player.flipX` for direction.
- Spawn `LickHitbox` offset by X=50px (relative to facing).
- If `stats.count >= 2`, spawn a second hitbox behind the player.

### Hitbox Logic (`LickHitbox`)
- **Visual:** Pink/Purple Rectangle/Sprite. Anchor: Left Center.
- **Duration:** 150ms.
- **Collision:**
    - 1 hit per enemy per swing (use `hitList`).
    - **Damage Falloff:** Damage reduces by **15%** for each subsequent enemy hit (Multiplicative).
    - **No Knockback**: Do not apply velocity changes.
    - **Paralysis**: 30% chance to Apply 0-vector knockback for 1000ms (stun).
    - Damage: `stats.damage * (0.85 ^ hitCount)`.

## UI
- Name: "Lick (舌舔)"

## Architecture
- **New Weapon Config:** `src/game/entities/weapons/specific/Lick.ts`
- **New Hitbox Entity:** `src/game/entities/weapons/hitboxes/LickHitbox.ts` (or `projectiles/`)
    - Will likely extend `Phaser.GameObjects.Rectangle` or `Phaser.Physics.Arcade.Sprite`.

## Verification
- **Manual Test:**
    - Equip Lick on Gastly (or default char).
    - Verify stats at each level (1-8).
    - Verify visual direction matches player facing.
    - Verify back shot at Lvl 4.
    - Verify No Knockback on hit.
    - Verify Paralysis (stun) at Lvl 8.
