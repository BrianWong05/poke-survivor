import Phaser from 'phaser';
import type { CharacterContext, UltimateConfig } from '@/game/entities/characters/types';
import { BoneRush } from '@/game/entities/weapons/specific/BoneRush';

/**
 * Pikachu's Gigantamax Thunder: Clears screen area, stuns all enemies
 */
export const gigantamaxThunder: UltimateConfig = {
  id: 'gigantamax-thunder',
  name: 'Gigantamax Thunder',
  description: 'Clears immediate screen area, stuns all enemies',
  cooldownMs: 30000, // 30 second cooldown
  execute: (ctx: CharacterContext) => {
    const scene = ctx.scene;
    
    // Visual effect: flash the screen yellow
    scene.cameras.main.flash(500, 255, 255, 0);
    
    // Get all enemies
    const enemies = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
    if (!enemies) return;
    
    // Damage and stun all enemies on screen
    enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;
      
      // Check if enemy is on screen
      const cam = scene.cameras.main;
      if (
        enemy.x >= cam.scrollX &&
        enemy.x <= cam.scrollX + cam.width &&
        enemy.y >= cam.scrollY &&
        enemy.y <= cam.scrollY + cam.height
      ) {
        // Deal massive damage (kill most enemies)
        enemy.setData('hp', 0);
        enemy.setActive(false);
        enemy.setVisible(false);
        
        // Spawn XP gem
        scene.events.emit('spawn-xp', enemy.x, enemy.y);
      }
    });
  },
};

/**
 * Charizard's Seismic Toss: Fly up invincible, rain fireballs, slam down
 */
export const seismicToss: UltimateConfig = {
  id: 'seismic-toss',
  name: 'Seismic Toss',
  description: 'Fly up (invincible 5s) raining fireballs, then slam ground',
  cooldownMs: 45000,
  durationMs: 5000,
  execute: (ctx: CharacterContext) => {
    const scene = ctx.scene;
    const player = ctx.player;
    
    // Make player invincible
    player.setData('invincible', true);
    player.setAlpha(0.5);
    
    // Fly up animation (move player up and scale down)
    scene.tweens.add({
      targets: player,
      y: player.y - 100,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 500,
    });
    
    // Rain fireballs during flight
    const fireballTimer = scene.time.addEvent({
      delay: 300,
      callback: () => {
        // Spawn fireball at random position
        const x = Phaser.Math.Between(50, scene.scale.width - 50);
        const y = Phaser.Math.Between(50, scene.scale.height - 50);
        scene.events.emit('spawn-aoe-damage', x, y, 50, ctx.stats.baseDamage * 2);
      },
      repeat: 15,
    });
    
    // After 5 seconds, slam down
    scene.time.delayedCall(5000, () => {
      fireballTimer.remove();
      
      // Slam down animation
      scene.tweens.add({
        targets: player,
        y: scene.scale.height / 2,
        scaleX: 2,
        scaleY: 2,
        duration: 300,
        onComplete: () => {
          // Screen nuke damage
          scene.cameras.main.shake(500, 0.02);
          scene.events.emit('spawn-aoe-damage', player.x, player.y, 500, ctx.stats.baseDamage * 5);
          
          // Reset player
          player.setScale(2); // Original sprite scale
          player.setAlpha(1);
          player.setData('invincible', false);
        },
      });
    });
  },
};

/**
 * Blastoise's Shell Smash: Pinball physics for 10s
 */
export const shellSmash: UltimateConfig = {
  id: 'shell-smash',
  name: 'Shell Smash',
  description: 'Retract into shell, pinball bounce for 10s crushing enemies',
  cooldownMs: 40000,
  durationMs: 10000,
  execute: (ctx: CharacterContext) => {
    const player = ctx.player;
    
    // Store original state
    player.setData('shellSmashActive', true);
    player.setData('canControl', false);
    
    // Visual: make player more circular/shell-like
    player.setTint(0x888888);
    
    // Set initial velocity in random direction
    const angle = Math.random() * Math.PI * 2;
    const speed = 400;
    player.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    
    // Bounce off walls (update handler checks this flag)
    player.setData('pinballMode', true);
  },
  onEnd: (ctx: CharacterContext) => {
    const player = ctx.player;
    
    player.setData('shellSmashActive', false);
    player.setData('canControl', true);
    player.setData('pinballMode', false);
    player.clearTint();
    player.setVelocity(0, 0);
  },
};

/**
 * Gengar's Destiny Bond: Reflect 500% damage to linked enemies
 */
export const destinyBond: UltimateConfig = {
  id: 'destiny-bond',
  name: 'Destiny Bond',
  description: 'Link to enemies for 5s. Damage taken reflected 500%',
  cooldownMs: 35000,
  durationMs: 5000,
  execute: (ctx: CharacterContext) => {
    const scene = ctx.scene;
    const player = ctx.player;
    
    // Mark all visible enemies as linked
    const enemies = scene.registry.get('enemiesGroup') as Phaser.Physics.Arcade.Group;
    if (!enemies) return;
    
    const linkedEnemies: Phaser.Physics.Arcade.Sprite[] = [];
    const cam = scene.cameras.main;
    
    enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;
      
      // Check if on screen
      if (
        enemy.x >= cam.scrollX &&
        enemy.x <= cam.scrollX + cam.width &&
        enemy.y >= cam.scrollY &&
        enemy.y <= cam.scrollY + cam.height
      ) {
        enemy.setData('destinyBonded', true);
        enemy.setTint(0x800080); // Purple tint
        linkedEnemies.push(enemy);
      }
    });
    
    // Store linked enemies for damage reflection
    player.setData('destinyBondedEnemies', linkedEnemies);
    player.setData('destinyBondActive', true);
    
    // Visual effect on player
    player.setTint(0x800080);
  },
  onEnd: (ctx: CharacterContext) => {
    const player = ctx.player;
    const linkedEnemies = player.getData('destinyBondedEnemies') as Phaser.Physics.Arcade.Sprite[] || [];
    
    // Clear linked status
    linkedEnemies.forEach((enemy) => {
      if (enemy.active) {
        enemy.setData('destinyBonded', false);
        enemy.clearTint();
      }
    });
    
    player.setData('destinyBondActive', false);
    player.setData('destinyBondedEnemies', []);
    player.clearTint();
  },
};

/**
 * Lucario's Bone Rush: Orbiting bones for 8s, +50% speed
 */
export const boneRush = new BoneRush();

/**
 * Snorlax's Rest: Sleep 3s invulnerable, heal 100%, wake AOE
 */
export const rest: UltimateConfig = {
  id: 'rest',
  name: 'Rest',
  description: 'Sleep 3s (invulnerable). Heal 100% HP. Wake up deals AOE',
  cooldownMs: 60000,
  durationMs: 3000,
  execute: (ctx: CharacterContext) => {
    const scene = ctx.scene;
    const player = ctx.player;
    
    // Become invulnerable and immobile
    player.setData('invincible', true);
    player.setData('canControl', false);
    player.setVelocity(0, 0);
    
    // Visual: darken and add ZZZ
    player.setTint(0x4444ff);
    
    // Heal to full over the duration
    const state = scene.registry.get('characterState');
    if (state) {
      state.currentHP = state.config.stats.maxHP;
      scene.events.emit('hp-update', state.currentHP);
    }
  },
  onEnd: (ctx: CharacterContext) => {
    const scene = ctx.scene;
    const player = ctx.player;
    
    // Wake up AOE damage
    scene.events.emit('spawn-aoe-damage', player.x, player.y, 150, ctx.stats.baseDamage * 3);
    scene.cameras.main.shake(300, 0.01);
    
    // Restore control
    player.setData('invincible', false);
    player.setData('canControl', true);
    player.clearTint();
  },
};
