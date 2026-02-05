import Phaser from 'phaser';
import { type CharacterState, type WeaponConfig } from '@/game/entities/characters/types';

import { createItem } from '@/game/entities/items/registry';

import { ExperienceManager } from '@/game/systems/ExperienceManager';
import { CombatManager } from '@/game/systems/CombatManager';
import { UIManager } from '@/game/systems/UIManager';
import { Player } from '@/game/entities/Player';

interface DebugWeaponEntry {
    name: string;
    timer: Phaser.Time.TimerEvent;
    level: number;
    baseConfig: WeaponConfig;
    activeConfig: WeaponConfig;
}

export class DevDebugSystem {
  private scene: Phaser.Scene;
  private player: Player; // Note: Player needs to be fetched or passed
  private characterState: CharacterState;
  private experienceManager: ExperienceManager;
  private combatManager: CombatManager;
  private uiManager: UIManager;
  
  // We need access to groups to kill enemies
  private enemiesGroup: Phaser.Physics.Arcade.Group;
  private legacyEnemiesGroup: Phaser.Physics.Arcade.Group;

  private debugWeapons: Map<string, DebugWeaponEntry> = new Map();
  // @ts-ignore
  private debugInvincible = false;
  private isMainWeaponRemoved = false;


  // We need to keep a reference to fireTimer if we are debugging the main weapon
  private mainWeaponFireTimerRef?: { get: () => Phaser.Time.TimerEvent, set: (t: Phaser.Time.TimerEvent) => void };
  
  private isGameOver: () => boolean;

  constructor(
      scene: Phaser.Scene,
      player: Player,
      characterState: CharacterState,
      experienceManager: ExperienceManager,
      combatManager: CombatManager,
      uiManager: UIManager,
      enemiesGroup: Phaser.Physics.Arcade.Group,
      legacyEnemiesGroup: Phaser.Physics.Arcade.Group,
      isGameOver: () => boolean
  ) {
    this.scene = scene;
    this.player = player;
    this.characterState = characterState;
    this.experienceManager = experienceManager;
    this.combatManager = combatManager;
    this.uiManager = uiManager;
    this.enemiesGroup = enemiesGroup;
    this.legacyEnemiesGroup = legacyEnemiesGroup;
    this.isGameOver = isGameOver;
  }

  // Set this up if we want to manipulate the main weapon timer
  public setMainWeaponTimerRef(get: () => Phaser.Time.TimerEvent, set: (t: Phaser.Time.TimerEvent) => void) {
      this.mainWeaponFireTimerRef = { get, set };
  }

  public debugLevelUp(
    isLevelUpPending: boolean, 
    _onLevelUp?: () => void, 
    _onComplete?: () => void,
    _onWeaponUpgrade?: () => void,
    _onNewWeapon?: (config: import('@/game/entities/characters/types').WeaponConfig) => void
  ): void {
    if (!this.experienceManager) return;
    
    // Add level
    const leveled = this.experienceManager.addInstantLevel();
    this.uiManager.updateLevelUI();
    
    // Check for Automatic Evolution
    if (leveled && this.player) {
         this.player.checkAndApplyEvolution(this.experienceManager.currentLevel);
    }

    // Trigger sequence if actually leveled up
    if (leveled && !isLevelUpPending) {
         // Cast scene to MainScene to access startLevelUpSequence
         const mainScene = this.scene as import('@/game/scenes/MainScene').MainScene;
         if (mainScene.startLevelUpSequence) {
             mainScene.startLevelUpSequence();
         }
    }
  }

  public debugAddLevels(count: number): void {
    const mainScene = this.scene as import('@/game/scenes/MainScene').MainScene;
    if (mainScene.cheatGrantLevels) {
      mainScene.cheatGrantLevels(count);
    }
  }

  public debugSetLevel(targetLevel: number): void {
    const mainScene = this.scene as import('@/game/scenes/MainScene').MainScene;
    if (mainScene.cheatSetLevel) {
      mainScene.cheatSetLevel(targetLevel);
    }
  }

  public debugHeal(): void {
    if (this.player) {
      this.combatManager.healPlayer(9999);
    }
  }

  public debugKillAll(): void {
    const killGroup = (group: Phaser.Physics.Arcade.Group) => {
      if (!group) return;
      group.getChildren().forEach((child) => {
        const enemy = child as Phaser.Physics.Arcade.Sprite;
        if (enemy.active) {
          this.combatManager.damageEnemy(enemy, 99999);
        }
      });
    };

    killGroup(this.enemiesGroup);
    killGroup(this.legacyEnemiesGroup);
  }

  public debugSetInvincible(enabled: boolean): void {
    this.debugInvincible = enabled;
    if (this.player) {
        this.player.setData('debugInvincible', enabled);
        if (enabled) {
            this.player.setAlpha(0.7); // Visual feedback
        } else {
             this.player.setAlpha(1);
        }
    }
    console.log(`[DevConsole] Invincible mode: ${enabled}`);
  }

  public debugSetPaused(paused: boolean): void {
      this.uiManager.setPaused(paused, false);
  }

  public getDebugItems(): { id: string, name: string, level: number }[] {
      if (!this.player) return [];
      return this.player.items.map(item => ({
          id: item.id,
          name: item.name,
          level: item.level
      }));
  }

  public debugAddItem(itemId: string): void {
      if (!this.player) return;

      const item = createItem(itemId);
      if (item) {
          this.player.addItem(item);
          console.log(`[DevConsole] Added item: ${itemId} (Level ${item.level})`);
      } else {
          console.warn(`[DevConsole] Failed to create item: ${itemId}`);
      }
  }

  public debugSetItemLevel(itemId: string, level: number): void {
      if (!this.player) return;
      this.player.setItemLevel(itemId, level);
  }

  public debugRemoveItem(itemId: string): void {
      if (!this.player) return;
      this.player.removeItem(itemId);
  }

  public debugAddWeapon(weaponConfig: WeaponConfig, _isGameOverUnused: boolean): void {
    if (!this.player) return;

    // 1. Check if it matches the main weapon (base or evolution)
    const isMainWeapon = this.characterState.config.weapon.id === weaponConfig.id || 
                       (this.characterState.config.weapon.evolution?.id === weaponConfig.id);

    if (isMainWeapon) {
        console.log(`[DevDebugSystem] Weapon ${weaponConfig.id} matches main weapon, leveling up.`);
        this.debugSetWeaponLevel('main_weapon', this.characterState.weaponLevel + 1);
        return;
    }

    // 2. Check if it matches any existing debug weapon
    for (const [debugId, entry] of this.debugWeapons.entries()) {
        const isMatch = entry.baseConfig.id === weaponConfig.id || 
                        (entry.baseConfig.evolution?.id === weaponConfig.id);
        
        if (isMatch) {
            console.log(`[DevDebugSystem] Weapon ${weaponConfig.id} matches debug weapon ${debugId}, leveling up.`);
            this.debugSetWeaponLevel(debugId, entry.level + 1);
            return;
        }
    }

    const id = `debug-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // We assume it's a valid WeaponConfig instance (or object)
    const baseWeapon: WeaponConfig = weaponConfig;

    const initialLevel = 1;
    let activeWeapon = baseWeapon;

    // Helper to fire
    const fireWeapon = (weapon: WeaponConfig, level: number) => {
         // Use internal isGameOver
         if (this.isGameOver && this.isGameOver()) return;
         if (this.player.getData('canControl') === false) return;
         
         const ctx = {
             scene: this.scene,
             player: this.player,
             stats: this.characterState.config.stats, // Access from state config
             currentHP: this.characterState.currentHP,
             level: Math.min(level, 8),
             xp: this.characterState.xp,
         };
         weapon.fire(ctx);
    };

    const timer = this.scene.time.addEvent({
      delay: baseWeapon.cooldownMs,
      callback: () => {
        const entry = this.debugWeapons.get(id);
        if (entry) {
            fireWeapon(entry.activeConfig, entry.level);
        }
      },
      loop: true,
    });

    // Fire immediately
    fireWeapon(activeWeapon, initialLevel);

    this.debugWeapons.set(id, { 
        name: baseWeapon.name, 
        timer,
        level: initialLevel,
        baseConfig: baseWeapon,
        activeConfig: activeWeapon
    });
    console.log(`[DevConsole] Added debug weapon: ${baseWeapon.name} (${id})`);
    this.scene.events.emit('inventory-updated');
  }

  public debugSetWeaponLevel(id: string, newLevel: number): void {
      if (newLevel > 8) newLevel = 8;
      if (newLevel < 1) newLevel = 1;

      if (id === 'main_weapon') {
          // Handle Main Weapon
          this.characterState.weaponLevel = newLevel;
          
          this.uiManager.updateLevelUI();

          // Trigger evolution check in MainScene
          const mainScene = this.scene as import('@/game/scenes/MainScene').MainScene;
          if (mainScene.applyWeaponEvolution) {
              mainScene.applyWeaponEvolution();
          }
          
          console.log(`[DevDebugSystem] Main Weapon level set to ${newLevel}`);
          this.scene.events.emit('inventory-updated');
          return;
      }

      const entry = this.debugWeapons.get(id);
      if (!entry) return;

      entry.level = newLevel;

      let nextConfig = entry.baseConfig;
      if (entry.baseConfig.evolution && entry.baseConfig.evolutionLevel && newLevel >= entry.baseConfig.evolutionLevel) {
          nextConfig = entry.baseConfig.evolution;
      }
      
      if (nextConfig !== entry.activeConfig) {
          console.log(`[DevConsole] Weapon ${entry.name} evolved to ${nextConfig.name}`);
          
          if (entry.activeConfig.id !== nextConfig.id) {
               this.player.setData(`weapon_active_${entry.activeConfig.id}`, false);
          }

          entry.activeConfig = nextConfig;
          entry.name = nextConfig.name; 
          
           const ctx = {
             scene: this.scene,
             player: this.player,
             stats: this.characterState.config.stats,
             currentHP: this.characterState.currentHP,
             level: entry.level,
             xp: this.characterState.xp,
          };
          entry.activeConfig.fire(ctx);
      }
  }

  public debugRemoveWeapon(id: string): void {
    if (id === 'main_weapon') {
        if (this.mainWeaponFireTimerRef) {
            const timer = this.mainWeaponFireTimerRef.get();
            if (timer) {
                timer.destroy();
                // We can't set it to undefined easily on the REF type if validation strict, 
                // but effectively we killed it.
                this.isMainWeaponRemoved = true;
                console.log(`[DevConsole] Removed main weapon`);
                this.scene.events.emit('inventory-updated');
            }
        }
        return;
    }

    const entry = this.debugWeapons.get(id);
    if (entry) {
        entry.timer.remove();
        this.debugWeapons.delete(id);
        console.log(`[DevConsole] Removed debug weapon: ${entry.name}`);
        this.scene.events.emit('inventory-updated');
    }
  }

  public getDebugWeapons(): { id: string, name: string, level: number }[] {
      const list: { id: string, name: string, level: number }[] = Array.from(this.debugWeapons.entries()).map(([id, data]) => ({
        id,
        name: data.activeConfig.name,
        level: data.level
      }));

      if (this.characterState && this.characterState.activeWeapon && !this.isMainWeaponRemoved) {
          list.unshift({
              id: 'main_weapon',
              name: `${this.characterState.activeWeapon.name} (Main)`,
              level: this.characterState.weaponLevel  // Use weaponLevel, not XP level
          });
      }
      return list;
  }

  /**
   * Get IDs of all active debug weapons (excluding main weapon)
   * Used to exclude already-owned weapons from level-up pool
   */
  public getActiveWeaponIds(): string[] {
    return Array.from(this.debugWeapons.values()).map(entry => entry.baseConfig.id);
  }

  public debugToggleMagnetRange(visible: boolean): void {
      if (this.player) {
          this.player.setMagnetRangeVisible(visible);
          console.log(`[DevConsole] Magnet Range Visualization: ${visible ? 'ON' : 'OFF'}`);
      }
  }

  public debugToggleHitboxes(visible: boolean): void {
      // Toggle physics debug rendering at runtime
      this.scene.physics.world.debugGraphic?.setVisible(visible);
      this.scene.physics.world.drawDebug = visible;
      
      // Force refresh debug graphic if enabling
      if (visible && !this.scene.physics.world.debugGraphic) {
          this.scene.physics.world.createDebugGraphic();
      }
      
      console.log(`[DevConsole] Show Hitboxes: ${visible ? 'ON' : 'OFF'}`);
  }
}
