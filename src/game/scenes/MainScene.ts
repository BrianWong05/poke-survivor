import Phaser from 'phaser';
import type { GameCallbacks } from '@/game/config';
import { getDirectionFromVelocity, type DirectionName } from '@/game/scenes/Preloader';
import { getCharacter } from '@/game/entities/characters/registry';
import {
  type CharacterConfig,
  type CharacterState,
  type CharacterContext,
  type WeaponConfig,
  createCharacterState,
} from '@/game/entities/characters/types';
import { ExperienceManager } from '@/game/systems/ExperienceManager';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import { ENEMY_STATS, EnemyType, EnemyTier } from '@/game/entities/enemies';
import { LootManager } from '@/game/systems/LootManager';

import { Player } from '@/game/entities/Player';

// New Systems
import { TextureManager } from '@/game/systems/TextureManager';
import { InputManager } from '@/game/systems/InputManager';
import { CombatManager } from '@/game/systems/CombatManager';
import { UIManager } from '@/game/systems/UIManager';
import { DevDebugSystem } from '@/game/systems/DevDebugSystem';

interface SpriteAnimation {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  directions: number;
}

interface SpriteManifestEntry {
  id: string;
  name: string;
  animations: SpriteAnimation[];
}

export class MainScene extends Phaser.Scene {
  // Core Entities
  private player!: Player;
  private characterConfig!: CharacterConfig;
  private characterState!: CharacterState;

  // Systems
  private textureManager!: TextureManager;
  private inputManager!: InputManager;
  private combatManager!: CombatManager;
  private uiManager!: UIManager;
  public debugSystem!: DevDebugSystem;
  private experienceManager!: ExperienceManager;
  private enemySpawner!: EnemySpawner;
  private lootManager!: LootManager;

  // Groups
  private enemies!: Phaser.Physics.Arcade.Group; // Legacy support
  private projectiles!: Phaser.Physics.Arcade.Group;
  private xpGems!: Phaser.Physics.Arcade.Group;
  private hazardGroup!: Phaser.Physics.Arcade.Group;

  // Game Loop State
  private score = 0;
  private survivalTime = 0;
  private lastTimeUpdate = 0;
  private fireTimer!: Phaser.Time.TimerEvent;
  private gameOver = false;
  private isLevelUpPending = false;
  
  // Callbacks
  private callbacks!: GameCallbacks;
  
  // Visuals
  private manifest: SpriteManifestEntry[] = [];
  private currentDirection: DirectionName = 'down';
  private usePlaceholderGraphics = false;
  private cullFrameCounter = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    // Expose scene globally for DevConsole
    (window as any).gameScene = this;

    // 1. Initialization
    this.callbacks = this.registry.get('callbacks') as GameCallbacks;
    const selectedCharacterId = this.registry.get('selectedCharacter') as string || 'pikachu';
    this.characterConfig = getCharacter(selectedCharacterId);
    this.characterState = createCharacterState(this.characterConfig);
    this.registry.set('characterState', this.characterState);

    this.manifest = this.registry.get('spriteManifest') as SpriteManifestEntry[] || [];
    this.usePlaceholderGraphics = this.manifest.length === 0;

    // 2. Systems Setup
    this.textureManager = new TextureManager(this);
    this.textureManager.createTextures();
    
    this.experienceManager = new ExperienceManager();
    
    // 3. Create Player & Groups
    this.createPlayer();
    this.createGroups();

    // 4. Advanced Systems Construction (Dependencies on groups/player)
    this.lootManager = new LootManager(this.xpGems);
    
    // UI Manager
    this.uiManager = new UIManager(
        this, 
        this.callbacks, 
        this.experienceManager, 
        this.characterState
    );

    // Combat Manager
    this.combatManager = new CombatManager(
        this,
        this.player,
        this.characterConfig,
        this.characterState,
        this.lootManager,
        this.callbacks,
        () => this.gameOver,
        () => this.handleGameOver()
    );

    // Debug System
    this.debugSystem = new DevDebugSystem(
        this,
        this.player,
        this.characterState,
        this.experienceManager,
        this.combatManager,
        this.uiManager,
        this.enemySpawner.getEnemyGroup() as Phaser.Physics.Arcade.Group,
        this.enemies,
        () => this.gameOver
    );

    // Input Manager
    this.inputManager = new InputManager(this);
    this.inputManager.setup(() => this.uiManager.togglePause(() => {
        // Handle visual pause state logic if needed
        this.combatManager.healPlayer(0); 
    }));

    // 5. Setup Collisions
    this.combatManager.setupCollisions(
        this.enemySpawner,
        this.projectiles,
        this.hazardGroup
    );
     
    /* Magnetism now handled by distance check in update for better precision */

    // XP Actual Collection (Inner Zone - Player Body)
    this.physics.add.overlap(
        this.player,
        this.xpGems,
        this.handleXPCollection.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
    );

    // 6. Event Listeners
    this.setupEventListeners();
    this.initializePassive();
    this.startTimers();

    // Initial UI Sync
    this.callbacks.onScoreUpdate(this.score);
    this.uiManager.updateLevelUI();
    
    // Wire up debug fire timer ref
    this.debugSystem.setMainWeaponTimerRef(
        () => this.fireTimer,
        (t) => { this.fireTimer = t; }
    );
  }

  private createPlayer(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const spriteKey = this.usePlaceholderGraphics ? 'player' : this.characterConfig.spriteKey;
    
    this.player = new Player(this, centerX, centerY, spriteKey);
    this.player.setExperienceManager(this.experienceManager);
    // Initialize stats from configuration
    this.player.setHealth(this.characterConfig.stats.maxHP, this.characterConfig.stats.maxHP);

    if (!this.usePlaceholderGraphics) {
      this.player.play(`${this.characterConfig.spriteKey}-idle-down`);
      this.player.setScale(2);
    }
  }

  private createGroups(): void {
    this.enemies = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 200,
      runChildUpdate: false,
    });

    this.enemySpawner = new EnemySpawner(this, this.player, this.experienceManager);

    this.projectiles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 50,
      runChildUpdate: false,
    });

    this.xpGems = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 100,
      runChildUpdate: false,
    });

    this.hazardGroup = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 50,
      runChildUpdate: false,
    });

    this.registry.set('enemiesGroup', this.enemySpawner.getEnemyGroup());
    this.registry.set('legacyEnemiesGroup', this.enemies);
    this.registry.set('projectilesGroup', this.projectiles);
    this.registry.set('xpGemsGroup', this.xpGems);
    this.registry.set('hazardGroup', this.hazardGroup);
    
    this.registry.set('rattataPool', this.enemySpawner.getRattataPool());
    this.registry.set('geodudePool', this.enemySpawner.getGeodudePool());
    this.registry.set('zubatPool', this.enemySpawner.getZubatPool());
  }

  private setupEventListeners(): void {
    this.events.on('spawn-xp', (x: number, y: number) => {
      this.lootManager.drop(x, y, EnemyTier.TIER_1);
    });

    this.events.on('spawn-aoe-damage', (x: number, y: number, radius: number, damage: number, isFinal: boolean = false) => {
      // Apply player might modifier unless strictly final
      const finalDamage = isFinal ? damage : (damage * this.player.might);
      this.combatManager.applyAOEDamage(x, y, radius, finalDamage, this.enemies);
      this.combatManager.applyAOEDamage(x, y, radius, finalDamage, this.enemySpawner.getEnemyGroup() as Phaser.Physics.Arcade.Group);
    });

    this.events.on('damage-enemy', (enemy: Phaser.Physics.Arcade.Sprite, damage: number, isFinal: boolean = false) => {
      // Apply player might modifier unless strictly final
      const finalDamage = isFinal ? damage : (damage * this.player.might);
      this.combatManager.damageEnemy(enemy, finalDamage);
    });

    this.events.on('hp-update', (hp: number) => {
      this.characterState.currentHP = hp;
    });

    this.events.on('max-hp-change', () => {
        // Just internal update if needed, but characterState.currentHP is usually used
    });

    this.events.on('player:heal', (amount: number) => {
      this.combatManager.healPlayer(amount);
    });

    this.events.on('enemy:death', (x: number, y: number, enemyType: EnemyType) => {
      const stats = ENEMY_STATS[enemyType];
      if (stats) {
        this.lootManager.drop(x, y, stats.tier);
      }
    });
  }

  private initializePassive(): void {
    const ctx = this.getCharacterContext();
    if (this.characterConfig.passive.onInit) {
      this.characterConfig.passive.onInit(ctx);
    }
  }

  private startTimers(): void {
    this.fireTimer = this.time.addEvent({
      delay: this.characterState.activeWeapon.cooldownMs,
      callback: () => this.fireWeapon(),
      callbackScope: this,
      loop: true,
    });
    this.enemySpawner.start();
  }

  // Exposed for Timers/Systems but kept private if possible
  private fireWeapon(): void {
    if (this.gameOver) return;
    if (this.player.getData('canControl') === false) return;
    const ctx = this.getCharacterContext();
    // Clamp level to max 8 for weapon stats
    const weaponCtx = { ...ctx, level: Math.min(ctx.level, 8) };
    this.characterState.activeWeapon.fire(weaponCtx);
  }

  private triggerUltimate(): void {
    if (this.gameOver) return;
    if (this.characterState.ultimateCooldownRemaining > 0) return;
    if (this.characterState.isUltimateActive) return;

    const ctx = this.getCharacterContext();
    const ultimate = this.characterConfig.ultimate;

    ultimate.execute(ctx);
    this.characterState.isUltimateActive = true;

    if (ultimate.durationMs && ultimate.durationMs > 0) {
      this.time.delayedCall(ultimate.durationMs, () => {
        if (ultimate.onEnd) {
          ultimate.onEnd(this.getCharacterContext());
        }
        this.characterState.isUltimateActive = false;
      });
    } else {
      this.characterState.isUltimateActive = false;
    }

    this.characterState.ultimateCooldownRemaining = ultimate.cooldownMs;
  }

  private getCharacterContext(): CharacterContext {
    return {
      scene: this,
      player: this.player,
      stats: this.characterConfig.stats,
      currentHP: this.characterState.currentHP,
      level: this.characterState.weaponLevel,  // Use weaponLevel for weapon power
      xp: this.characterState.xp,
    };
  }

  private handleGameOver(): void {
    this.gameOver = true;
    this.uiManager.setGameOver(true);
    if (this.fireTimer) this.fireTimer.remove();
    this.enemySpawner.stop();
    this.player.setVelocity(0, 0);
    this.callbacks.onGameOver();
    
    // Stop all game visuals immediately
    if (this.physics.world) this.physics.pause();
    this.anims.pauseAll();
    this.tweens.pauseAll();
    this.time.paused = true;
  }

  /* Removed handleXPMagnetism as it is now handled by distance check in update */

  private handleXPCollection(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    candyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const candy = candyObj as Phaser.Physics.Arcade.Sprite;
    if (!candy.active) return;

    candy.disableBody(true, true);
    candy.setActive(false);

    const xpValue = (candy.getData('xpValue') as number) || 1;
    const isRareCandy = candy.getData('lootType') === 'rare-candy'; 

    let canLevelUp = false;
    
    // Rare Candy just gives Instant Level now
    if (isRareCandy) {
        canLevelUp = this.experienceManager.addInstantLevel();
    } else {
        canLevelUp = this.player.gainExperience(xpValue);
    }
    
    this.score += xpValue;
    this.callbacks.onScoreUpdate(this.score);
    this.uiManager.updateLevelUI();

    // Check for Automatic Evolution on Level Up
    if (canLevelUp) {
         // Try to evolve immediately upon reaching criteria
         const evolved = this.player.checkAndApplyEvolution(this.experienceManager.currentLevel);
         if (evolved) {
             console.log('[MainScene] Auto-evolution triggered!');
         }
         
         if (!this.isLevelUpPending) {
             this.startLevelUpSequence();
         }
    }
  }

  /**
   * Centralized Level Up Sequence
   * Handles visual effects, pausing, scene launching, and recursive checks
   */
  public startLevelUpSequence(): void {
      if (this.isLevelUpPending) return;
      
      this.isLevelUpPending = true;
      this.uiManager.setLevelUpPending(true);
      
      this.cameras.main.flash(500, 255, 255, 255, false, (_camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress === 1) {
          if (!this.sys || !this.sys.isActive()) return;

           // Get list of active debug weapon IDs
           const activeWeaponIds = this.debugSystem.getActiveWeaponIds ? 
             this.debugSystem.getActiveWeaponIds() : [];
           
           // Pause the entire MainScene
           this.scene.pause('MainScene');
              
           this.scene.launch('LevelUpScene', {
             player: this.player,
             characterState: this.characterState,
             activeWeaponIds,
             onComplete: () => {
               // Resume MainScene
               this.scene.resume('MainScene');
               
               // On Resume - check for more pending levels
               // Always commit the level we just finished selecting for
               this.experienceManager.processLevelUp();

               if (this.experienceManager.hasPendingLevelUp) {
                 // Reset flag momentarily to allow re-entry
                 this.isLevelUpPending = false; 
                 // Recursively start next sequence immediately
                 this.startLevelUpSequence();
               } else {
                 this.isLevelUpPending = false;
                 this.uiManager.setLevelUpPending(false);
               }
             },
             onWeaponUpgrade: () => this.handleWeaponLevelUp(),
             onNewWeapon: (config: import('@/game/entities/characters/types').WeaponConfig) => this.handleNewWeapon(config)
           });
        }
      });
  }

  /**
   * Handle weapon level up when player selects weapon upgrade
   */
  private handleWeaponLevelUp(): void {
    // Increment weapon level (this is what drives weapon power)
    this.characterState.weaponLevel++;
    this.applyWeaponEvolution();
    
    console.log(`[MainScene] Weapon leveled up to Lv.${this.characterState.weaponLevel}`);
  }

  /**
   * Check and apply weapon evolution based on current weaponLevel
   */
  public applyWeaponEvolution(): void {
    const evolutionLevel = this.characterConfig.weapon.evolutionLevel ?? 5;
    const currentWeaponLevel = this.characterState.weaponLevel;

    if (!this.characterState.isEvolved && 
        currentWeaponLevel >= evolutionLevel && 
        this.characterConfig.weapon.evolution) {
      
      this.characterState.activeWeapon = this.characterConfig.weapon.evolution;
      this.characterState.isEvolved = true;
      
      this.restartMainWeaponTimer();
      
      console.log(`[MainScene] Weapon evolved to ${this.characterState.activeWeapon.name}!`);
    } else if (this.characterState.isEvolved && currentWeaponLevel < evolutionLevel) {
        // DevConsole De-evolution support
        this.characterState.activeWeapon = this.characterConfig.weapon;
        this.characterState.isEvolved = false;
        this.restartMainWeaponTimer();
        console.log(`[MainScene] Weapon de-evolved to ${this.characterState.activeWeapon.name}`);
    }
  }

  /**
   * Restarts the main weapon fire timer with current weapon's cooldown.
   * Useful when weapon evolves or stats change.
   */
  public restartMainWeaponTimer(): void {
    if (this.fireTimer) {
        this.fireTimer.remove();
    }
    
    this.fireTimer = this.time.addEvent({
      delay: this.characterState.activeWeapon.cooldownMs,
      callback: () => this.fireWeapon(),
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Handle acquiring a new weapon when player selects it from level-up pool
   */
  private handleNewWeapon(config: WeaponConfig): void {
    // Add the new weapon via DevDebugSystem (same system used by DevConsole)
    this.debugSystem.debugAddWeapon(config, this.gameOver);
    console.log(`[MainScene] Acquired new weapon: ${config.name}`);
  }

  /**
   * Cheat: Grant XP for N levels and trigger sequence.
   */
  public cheatGrantLevels(count: number): void {
    this.experienceManager.grantCheatLevels(count);
    this.uiManager.updateLevelUI();
    
    // Trigger sequence to allow user to pick rewards for the new levels
    this.startLevelUpSequence();
    
    console.log(`[Cheat] Granted ${count} levels. New Level: ${this.experienceManager.currentLevel}`);
  }

  /**
   * Cheat: Set exact level.
   * Calculates difference and grants levels if target > current.
   */
  public cheatSetLevel(targetLevel: number): void {
      const currentLevel = this.experienceManager.currentLevel;
      if (targetLevel > currentLevel) {
          const diff = targetLevel - currentLevel;
          this.cheatGrantLevels(diff);
      } else {
          console.log(`[Cheat] Target level ${targetLevel} is not higher than current ${currentLevel}. Ignoring.`);
      }
  }

  private cullExcessCandies(): void {
    const MAX_CANDIES = 300;
    const CULL_COUNT = 50;
    
    const activeCandies = this.xpGems.getChildren().filter(
      (child) => (child as Phaser.Physics.Arcade.Sprite).active
    ) as Phaser.Physics.Arcade.Sprite[];
    
    if (activeCandies.length <= MAX_CANDIES) return;
    
    activeCandies.sort((a, b) => {
      const distA = Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y);
      const distB = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
      return distB - distA;
    });
    
    for (let i = 0; i < CULL_COUNT && i < activeCandies.length; i++) {
      activeCandies[i].setActive(false);
      activeCandies[i].setVisible(false);
    }
  }

  public setJoystickVector(x: number, y: number): void {
      this.inputManager.setJoystickVector(x, y);
  }

  // Proxy Debug Methods removed - usage moved to debugSystem directly


  update(_time: number, delta: number): void {
    // We access internal isPaused via UIManager implicitly by checking scene pause state? 
    // Actually UIManager manages a local isPaused flag but toggles Scene pause.
    // If scene is paused, update() shouldn't run usually (if scene.pause() is called).
    // But we manually check flags too.
    if (this.gameOver || this.time.paused) return;

    this.survivalTime += delta;
    if (this.survivalTime - this.lastTimeUpdate >= 1000) {
      this.lastTimeUpdate = this.survivalTime;
      if (this.callbacks.onTimeUpdate) {
        this.callbacks.onTimeUpdate(this.survivalTime);
      }
    }

    this.cullFrameCounter++;
    if (this.cullFrameCounter >= 60) {
      this.cullFrameCounter = 0;
      this.cullExcessCandies();
    }

    this.enemySpawner.update(delta);

    if (this.characterState.ultimateCooldownRemaining > 0) {
      this.characterState.ultimateCooldownRemaining -= delta;
    }

    // Input Handling
    if (this.inputManager.isUltimateTriggered()) {
      this.triggerUltimate();
    }

    const canControl = this.player.getData('canControl') !== false;
    
    // Pinball Mode
    if (this.player.getData('pinballMode')) {
         // This logic is specific to Blastoise Ultimate. 
         // Could be moved to Player class or config, but fine here for now.
         const body = this.player.body as Phaser.Physics.Arcade.Body;
         if (this.player.x <= 0 || this.player.x >= this.scale.width) body.velocity.x *= -1;
         if (this.player.y <= 0 || this.player.y >= this.scale.height) body.velocity.y *= -1;

         this.enemySpawner.getEnemyGroup().getChildren().forEach((child) => {
            const enemy = child as Phaser.Physics.Arcade.Sprite;
            if (!enemy.active) return;
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) <= 40) {
               this.combatManager.damageEnemy(enemy, this.characterConfig.stats.baseDamage * 2);
            }
         });
    }

    // Movement
    let finalVelocity = { x: 0, y: 0 };
    if (canControl) {
        const inputVector = this.inputManager.getMovementVector();
        const speedMultiplier = this.player.moveSpeedMultiplier;
        // Use player.characterConfig to ensure evolved stats are used
        const speed = this.player.characterConfig.stats.speed * speedMultiplier;
        finalVelocity = { x: inputVector.x * speed, y: inputVector.y * speed };
        this.player.setVelocity(finalVelocity.x, finalVelocity.y);
    }

    // Animation
    if (!this.usePlaceholderGraphics && canControl) {
      const isMoving = finalVelocity.x !== 0 || finalVelocity.y !== 0;
      const animState = isMoving ? 'walk' : 'idle';
      if (isMoving) {
        const direction = getDirectionFromVelocity(finalVelocity.x, finalVelocity.y);
        
        // Update horizontal facing preference
        if (direction.includes('left')) {
            this.player.setData('horizontalFacing', 'left');
        } else if (direction.includes('right')) {
            this.player.setData('horizontalFacing', 'right');
        }
        
        if (direction !== this.currentDirection) {
          this.currentDirection = direction;
          this.player.setData('facingDirection', direction); // Sync explicit direction too
        }
      }
      this.player.play(`${this.player.characterConfig.spriteKey}-${animState}-${this.currentDirection}`, true);
    }

    // Enemy AI
    this.enemySpawner.getEnemyGroup().getChildren().forEach((child) => {
       const enemy = child as Phaser.Physics.Arcade.Sprite;
       if (!enemy.active || enemy.getData('stunned')) {
           if (enemy.active) enemy.setVelocity(0, 0);
           return;
       }

       // CRITICAL FIX: Respect Knockback State
       if ((enemy as any).isKnockedBack) return;

       const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
       const enemySpeed = 80;
       const vx = Math.cos(angle) * enemySpeed;
       const vy = Math.sin(angle) * enemySpeed;
       enemy.setVelocity(vx, vy);

       if (!this.usePlaceholderGraphics) {
          const spriteName = enemy.getData('spriteName');
          if (spriteName) {
             const newDirection = getDirectionFromVelocity(vx, vy);
             if (newDirection !== enemy.getData('currentDirection')) {
                 enemy.setData('currentDirection', newDirection);
                 enemy.play(`${spriteName}-walk-${newDirection}`);
             }
          }
       }
    });

    // Magnetized XP Gems movement
    this.xpGems.getChildren().forEach((child) => {
        const gem = child as Phaser.Physics.Arcade.Sprite;
        if (!gem.active) return;

        // Precise Distance Check for Magnetism trigger
        if (!gem.getData('isMagnetized')) {
            const dist = Phaser.Math.Distance.Between(gem.x, gem.y, this.player.x, this.player.y);
            if (dist <= this.player.magnetRadius) {
                gem.setData('isMagnetized', true);
            }
        }

        // Movement logic for magnetized gems
        if (gem.getData('isMagnetized')) {
            const angle = Phaser.Math.Angle.Between(gem.x, gem.y, this.player.x, this.player.y);
            const speed = 400; // Suck in speed
            gem.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
    });

    // Passive update
    if (this.characterConfig.passive.onUpdate) {
      const ctx = this.getCharacterContext();
      this.characterConfig.passive.onUpdate(ctx, delta);
    }
  }
}
