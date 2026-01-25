import Phaser from 'phaser';
import type { CharacterContext, DamageType, PassiveConfig } from '@/game/entities/characters/types';

/**
 * Pikachu's Static passive: 30% chance to stun enemies on touch for 0.5s
 */
export const staticPassive: PassiveConfig = {
  id: 'static',
  nameKey: 'passive_static_name',
  descKey: 'passive_static_desc',
  onEnemyTouch: (ctx: CharacterContext, enemy: Phaser.Physics.Arcade.Sprite) => {
    if (Math.random() < 0.3) {
      // Stun the enemy by setting velocity to 0 and marking as stunned
      enemy.setVelocity(0, 0);
      enemy.setData('stunned', true);
      enemy.setTint(0xffff00); // Yellow tint to show stun
      
      ctx.scene.time.delayedCall(500, () => {
        if (enemy.active) {
          enemy.setData('stunned', false);
          enemy.clearTint();
        }
      });
    }
  },
};

/**
 * Charizard's Blaze passive: +1% damage for every 1% HP missing
 */
export const blazePassive: PassiveConfig = {
  id: 'blaze',
  nameKey: 'passive_blaze_name',
  descKey: 'passive_blaze_desc',
  // Damage bonus is calculated at fire time in weapon, not here
  // This passive is checked when calculating damage
};

/**
 * Blastoise's Rain Dish passive: Regenerate 1 HP every 5 seconds
 */
export const rainDishPassive: PassiveConfig = {
  id: 'rain-dish',
  nameKey: 'passive_raindish_name',
  descKey: 'passive_raindish_desc',
  onInit: (ctx: CharacterContext) => {
    // Set up regeneration timer
    ctx.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        // Access character state through scene registry
        const state = ctx.scene.registry.get('characterState');
        if (state && state.currentHP < state.config.stats.maxHP) {
          state.currentHP = Math.min(state.currentHP + 1, state.config.stats.maxHP);
          // Emit HP update event
          ctx.scene.events.emit('hp-update', state.currentHP);
        }
      },
      loop: true,
    });
  },
};

/**
 * Gengar's Shadow Tag passive: Dark aura pulls enemies and increases damage
 */
export const shadowTagPassive: PassiveConfig = {
  id: 'shadow-tag',
  nameKey: 'passive_shadowtag_name',
  descKey: 'passive_shadowtag_desc',
  onInit: (ctx: CharacterContext) => {
    // Create dark aura visual
    const aura = ctx.scene.add.circle(ctx.player.x, ctx.player.y, 150, 0x4a0080, 0.3);
    aura.setDepth(5);
    ctx.player.setData('shadowTagAura', aura);
    ctx.player.setData('shadowTagRadius', 150);
  },
  onUpdate: (ctx: CharacterContext, _delta: number) => {
    const aura = ctx.player.getData('shadowTagAura') as Phaser.GameObjects.Arc;
    const radius = ctx.player.getData('shadowTagRadius') as number || 150;
    
    if (aura) {
      // Follow player
      aura.setPosition(ctx.player.x, ctx.player.y);
    }
    
    // Get enemies and apply pull + damage buff
    const enemies = ctx.scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
    if (!enemies) return;
    
    enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;
      
      const dist = Phaser.Math.Distance.Between(
        ctx.player.x, ctx.player.y,
        enemy.x, enemy.y
      );
      
      if (dist <= radius) {
        // Mark enemy for +25% damage
        enemy.setData('shadowTagged', true);
        
        // Apply slight push away from Gengar
        const angle = Phaser.Math.Angle.Between(
          ctx.player.x, ctx.player.y,
          enemy.x, enemy.y
        );
        const pushForce = 30; // Subtle push
        const currentVx = enemy.body?.velocity.x ?? 0;
        const currentVy = enemy.body?.velocity.y ?? 0;
        enemy.setVelocity(
          currentVx + Math.cos(angle) * pushForce,
          currentVy + Math.sin(angle) * pushForce
        );
        
        // Visual: purple tint
        if (!enemy.getData('shadowTagTinted')) {
          enemy.setTint(0x6b2d8b);
          enemy.setData('shadowTagTinted', true);
        }
      } else {
        // Remove shadow tag when outside aura
        if (enemy.getData('shadowTagged')) {
          enemy.setData('shadowTagged', false);
          enemy.setData('shadowTagTinted', false);
          enemy.clearTint();
        }
      }
    });
  },
};

/**
 * Lucario's Inner Focus passive: +20% projectile size, immunity to stun
 */
export const innerFocusPassive: PassiveConfig = {
  id: 'inner-focus',
  nameKey: 'passive_innerfocus_name',
  descKey: 'passive_innerfocus_desc',
  onInit: (ctx: CharacterContext) => {
    // Projectile size bonus
    if (ctx.player) {
        ctx.player.projectileSizeModifier = 1.2;
    }
  },
  // Stun immunity is checked in damage handler
  onDamageTaken: (ctx: CharacterContext, damage: number, _damageType: DamageType) => {
    // Clear any stun effects
    ctx.player.setData('stunned', false);
    return damage; // No damage reduction, just stun immunity
  },
};

/**
 * Snorlax's Thick Fat passive: -50% damage from Fire/Ice
 * Note: Stubbed - damage types not fully implemented yet
 */
export const thickFatPassive: PassiveConfig = {
  id: 'thick-fat',
  nameKey: 'passive_thickfat_name',
  descKey: 'passive_thickfat_desc',
  onDamageTaken: (_ctx: CharacterContext, damage: number, damageType: DamageType) => {
    // Reduce damage from fire/ice by 50%
    if (damageType === 'fire' || damageType === 'ice') {
      return Math.floor(damage * 0.5);
    }
    return damage;
  },
};
