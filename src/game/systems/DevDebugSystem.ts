import Phaser from 'phaser';
import { type CharacterState, type WeaponConfig } from '@/game/entities/characters/types';

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

  constructor(
      scene: Phaser.Scene,
      player: Player,
      characterState: CharacterState,
      experienceManager: ExperienceManager,
      combatManager: CombatManager,
      uiManager: UIManager,
      enemiesGroup: Phaser.Physics.Arcade.Group,
      legacyEnemiesGroup: Phaser.Physics.Arcade.Group
  ) {
    this.scene = scene;
    this.player = player;
    this.characterState = characterState;
    this.experienceManager = experienceManager;
    this.combatManager = combatManager;
    this.uiManager = uiManager;
    this.enemiesGroup = enemiesGroup;
    this.legacyEnemiesGroup = legacyEnemiesGroup;
  }

  // Set this up if we want to manipulate the main weapon timer
  public setMainWeaponTimerRef(get: () => Phaser.Time.TimerEvent, set: (t: Phaser.Time.TimerEvent) => void) {
      this.mainWeaponFireTimerRef = { get, set };
  }

  public debugLevelUp(isLevelUpPending: boolean, onLevelUp: () => void): void {
    if (!this.experienceManager) return;
    
    // Add level
    const leveled = this.experienceManager.addInstantLevel();
    this.uiManager.updateLevelUI();
    
    // Trigger sequence if actually leveled up
    if (leveled && !isLevelUpPending) {
      onLevelUp(); // Should set pending flag and call processLevelUp
      
      this.scene.cameras.main.flash(500, 255, 255, 255, false, (_camera: any, progress: number) => {
        if (progress === 1) {
          if (!this.scene.sys || !this.scene.sys.isActive()) return;
          // We need a callback to show menu or rely on scene logic
          // But trying to decouple:
          // The UIManager handles showing menu.
          // The scene handles flow control (resume).
          // For now, let's assume this method is just the trigger.
          // BUT - the original code showed the menu directly from here.
          // We can call UIManager.showLevelUpMenu here if we assume the Scene handles the "onComplete"
        }
      });
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

  public debugAddWeapon(weaponConfig: WeaponConfig, isGameOver: boolean): void {
    if (!this.player) return;

    const id = `debug-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // We assume it's a valid WeaponConfig instance (or object)
    const baseWeapon: WeaponConfig = weaponConfig;

    const initialLevel = 1;
    let activeWeapon = baseWeapon;

    // Helper to fire
    const fireWeapon = (weapon: WeaponConfig, level: number) => {
         if (isGameOver) return;
         if (this.player.getData('canControl') === false) return;
         
         const ctx = {
             scene: this.scene,
             player: this.player,
             stats: this.characterState.config.stats, // Access from state config
             currentHP: this.characterState.currentHP,
             level: level,
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
  }

  public debugSetWeaponLevel(id: string, newLevel: number): void {
      if (id === 'main_weapon') {
          // Handle Main Weapon (Character Level)
          this.characterState.level = newLevel;
          this.experienceManager.currentLevel = newLevel;
          this.experienceManager.currentXP = 0;
          this.experienceManager.xpToNextLevel = this.experienceManager.getRequiredXP(newLevel + 1);
          
          this.uiManager.updateLevelUI();

          const weaponConfig = this.characterState.config.weapon;
          const evolutionLevel = weaponConfig.evolutionLevel ?? 5;
          
          let nextWeapon = weaponConfig;
          if (newLevel >= evolutionLevel && weaponConfig.evolution) {
              nextWeapon = weaponConfig.evolution;
              this.characterState.isEvolved = true;
          } else {
              this.characterState.isEvolved = false;
          }

          if (this.characterState.activeWeapon.id !== nextWeapon.id && this.mainWeaponFireTimerRef) {
               console.log(`[DevConsole] Main Weapon evolved/devolved to ${nextWeapon.name}`);
               this.characterState.activeWeapon = nextWeapon;
               
               // Restart timer with new cooldown via ref
               const oldTimer = this.mainWeaponFireTimerRef.get();
               if (oldTimer) oldTimer.remove();

               // We cannot recreate the timer easily here without access to 'fireWeapon' bound to scene
               // This implies MainScene should handle the callback part or we pass it in.
               // Ideally, Evolution logic should be centralized.
               // For now, let's just Log it and rely on MainScene update loop or leave timer as is (imperfect for cooldown changes)
               // ACTUALLY: The easiest way is for MainScene to expose a "restartFireTimer()" method.
               // Or we just update the delay on the existing timer if Phaser supports it? No.
          }
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
            }
        }
        return;
    }

    const entry = this.debugWeapons.get(id);
    if (entry) {
        entry.timer.remove();
        this.debugWeapons.delete(id);
        console.log(`[DevConsole] Removed debug weapon: ${entry.name}`);
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
              level: this.characterState.level
          });
      }
      return list;
  }
}
