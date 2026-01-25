# Implement Gastly's Lick Weapon

## Summary
Implement Gastly's innate weapon **Lick** alongside its evolution **Dream Eater**. This introduces a new **Paralysis** status effect for enemies, enabling crowd control and combo-based damage/healing mechanics.

## Motivation
To provide Gastly with a unique playstyle focusing on short-range crowd control and sustain, distinguishing it from other characters like Pikachu (AoE) or Squirtle (Knockback).

## Technical Changes

### 1. Status Effect: Paralysis
- Modify `Enemy` class to support paralysis.
- **Behavior:** Stops movement (`speed = 0`) and applies yellow tint (`0xFFFF00`) for a duration.
- **Fields:** `isParalyzed`, `originalSpeed`.

### 2. New Projectile: TongueLash
- A short-lived (150ms) directional hitbox (`Phaser.Physics.Arcade.Sprite`).
- **Visuals:** Pink rectangle (Lick) or Purple (Dream Eater).
- **Logic:** Rotates to match player facing direction.

### 3. New Weapon: Lick / Dream Eater
- **Lick (Level 1-7):** Short range (80px), 15 dmg, 30% paralysis chance.
- **Dream Eater (Level 8+):** Huge range (200px), 50 dmg, Purple visual.
- **Combo Mechanic:** If target is paralyzed:
    - Deals double damage (100).
    - Heals player (2 HP, capped at 10 HP/cast).

## Verification
- **Manual Test:** 
    - Select Gastly (or equip Lick).
    - Helper command to spawn enemies.
    - Verify yellow tint and stop on hit.
    - Level up to 8. Verify purple visual and increased range.
    - Verify healing when hitting paralyzed enemies.
