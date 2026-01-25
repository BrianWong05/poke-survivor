import Phaser from 'phaser';
import type { GameCallbacks } from '@/game/config';
import { getDirectionFromVelocity, type DirectionName } from '@/game/scenes/Preloader';
import { getCharacter } from '@/game/entities/characters/registry';
import {
  type CharacterConfig,
  type CharacterState,
  type CharacterContext,
  createCharacterState,
} from '@/game/entities/characters/types';
import {
  ExperienceManager,
} from '@/game/systems/ExperienceManager';
import { EnemySpawner } from '@/game/systems/EnemySpawner';
import { ENEMY_STATS, EnemyType, EnemyTier } from '@/game/entities/enemies';
import { LootManager } from '@/game/systems/LootManager';
import { LootItemType } from '@/game/systems/LootConfig';

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
  // Player
  private player!: Phaser.Physics.Arcade.Sprite;
  private isInvincible = false;

  // Character System
  private characterConfig!: CharacterConfig;
  private characterState!: CharacterState;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private joystickVector = { x: 0, y: 0 };

  // Groups
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private xpGems!: Phaser.Physics.Arcade.Group;

  // Enemy Spawner System
  private enemySpawner!: EnemySpawner;
  
  // Loot System
  private lootManager!: LootManager;

  // Game state
  private score = 0;
  private fireTimer!: Phaser.Time.TimerEvent;
  private gameOver = false;
  private isLevelUpPending = false;

  // Callbacks
  private callbacks!: GameCallbacks;

  // Sprite data
  private manifest: SpriteManifestEntry[] = [];
  private currentDirection: DirectionName = 'down';
  private usePlaceholderGraphics = false;

  // Experience Manager
  private experienceManager!: ExperienceManager;
  private cullFrameCounter = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    // Get callbacks from registry
    this.callbacks = this.registry.get('callbacks') as GameCallbacks;

    // Get selected character from registry (default to pikachu)
    const selectedCharacterId = this.registry.get('selectedCharacter') as string || 'pikachu';
    this.characterConfig = getCharacter(selectedCharacterId);
    this.characterState = createCharacterState(this.characterConfig);

    // Store character state in registry for passives/ultimates to access
    this.registry.set('characterState', this.characterState);

    // Get sprite manifest from registry (set by Preloader)
    this.manifest = this.registry.get('spriteManifest') as SpriteManifestEntry[] || [];

    // Determine if we're using placeholder graphics (no manifest loaded)
    if (this.manifest.length > 0) {
      this.usePlaceholderGraphics = false;
    } else {
      this.usePlaceholderGraphics = true;
    }

    // Generate placeholder textures (used as fallback or for projectiles/gems)
    this.createTextures();

    // Initialize Experience Manager
    this.experienceManager = new ExperienceManager();

    // Create player
    this.createPlayer();

    // Create groups
    this.createGroups();

    // Initialize Loot Manager (depends on xpGems from createGroups)
    this.lootManager = new LootManager(this.xpGems);

    // Setup input
    this.setupInput();

    // Setup collisions
    this.setupCollisions();

    // Setup event listeners for weapons/ultimates
    this.setupEventListeners();

    // Initialize passive
    this.initializePassive();

    // Start timers
    this.startTimers();

    // Initial callback updates
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onHPUpdate(this.characterState.currentHP);
    
    // Send level info
    if (this.callbacks.onLevelUpdate) {
      this.callbacks.onLevelUpdate(this.characterState.level, this.characterState.xp, this.characterState.xpToNextLevel);
    }
  }

  private createTextures(): void {
    // Player: Blue circle (32px) - fallback
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x4a9eff, 1);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Enemy: Red square (24px) - legacy fallback
    const enemyGraphics = this.make.graphics({ x: 0, y: 0 });
    enemyGraphics.fillStyle(0xff4a4a, 1);
    enemyGraphics.fillRect(0, 0, 24, 24);
    enemyGraphics.generateTexture('enemy', 24, 24);
    enemyGraphics.destroy();

    // Enemy variant placeholders (colored circles)
    // Rattata: Purple circle (24px)
    const rattataStats = ENEMY_STATS[EnemyType.RATTATA];
    if (!this.textures.exists(rattataStats.textureKey)) {
      const rattataGraphics = this.make.graphics({ x: 0, y: 0 });
      rattataGraphics.fillStyle(rattataStats.placeholderColor, 1);
      rattataGraphics.fillCircle(rattataStats.placeholderSize / 2, rattataStats.placeholderSize / 2, rattataStats.placeholderSize / 2);
      rattataGraphics.generateTexture(rattataStats.textureKey, rattataStats.placeholderSize, rattataStats.placeholderSize);
      rattataGraphics.destroy();
    }

    // Geodude: Grey circle (28px)
    const geodudeStats = ENEMY_STATS[EnemyType.GEODUDE];
    if (!this.textures.exists(geodudeStats.textureKey)) {
      const geodudeGraphics = this.make.graphics({ x: 0, y: 0 });
      geodudeGraphics.fillStyle(geodudeStats.placeholderColor, 1);
      geodudeGraphics.fillCircle(geodudeStats.placeholderSize / 2, geodudeStats.placeholderSize / 2, geodudeStats.placeholderSize / 2);
      geodudeGraphics.generateTexture(geodudeStats.textureKey, geodudeStats.placeholderSize, geodudeStats.placeholderSize);
      geodudeGraphics.destroy();
    }

    // Zubat: Blue circle (20px)
    const zubatStats = ENEMY_STATS[EnemyType.ZUBAT];
    if (!this.textures.exists(zubatStats.textureKey)) {
      const zubatGraphics = this.make.graphics({ x: 0, y: 0 });
      zubatGraphics.fillStyle(zubatStats.placeholderColor, 1);
      zubatGraphics.fillCircle(zubatStats.placeholderSize / 2, zubatStats.placeholderSize / 2, zubatStats.placeholderSize / 2);
      zubatGraphics.generateTexture(zubatStats.textureKey, zubatStats.placeholderSize, zubatStats.placeholderSize);
      zubatGraphics.destroy();
    }

    // Projectile: White circle (8px)
    const projectileGraphics = this.make.graphics({ x: 0, y: 0 });
    projectileGraphics.fillStyle(0xffffff, 1);
    projectileGraphics.fillCircle(4, 4, 4);
    projectileGraphics.generateTexture('projectile', 8, 8);
    projectileGraphics.destroy();

    // Exp Candy sprites are loaded in Preloader (assets/candies/)
    // Texture keys: candy-s, candy-m, candy-l, candy-xl, candy-rare
  }

  private createPlayer(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    if (this.usePlaceholderGraphics) {
      this.player = this.physics.add.sprite(centerX, centerY, 'player');
    } else {
      this.player = this.physics.add.sprite(centerX, centerY, this.characterConfig.spriteKey);
      this.player.play(`${this.characterConfig.spriteKey}-idle-down`);
      // Scale sprite to reasonable size (PMD sprites are small)
      this.player.setScale(2);
    }
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);

    // Set Inner Focus flag for Lucario
    if (this.characterConfig.passive.id === 'inner-focus') {
      this.player.setData('innerFocus', true);
    }
  }

  private createGroups(): void {
    // Legacy enemies group (kept for backward compatibility with some ultimates)
    this.enemies = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 200,
      runChildUpdate: false,
    });

    // Initialize EnemySpawner system
    this.enemySpawner = new EnemySpawner(this, this.player);

    // Projectiles group with pooling
    this.projectiles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 50,
      runChildUpdate: false,
    });

    // XP gems group with pooling
    this.xpGems = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 100,
      runChildUpdate: false,
    });

    // Store groups in registry for weapons/ultimates to access
    // Use the enemy spawner's combined group as the main enemies group
    this.registry.set('enemiesGroup', this.enemySpawner.getEnemyGroup());
    this.registry.set('legacyEnemiesGroup', this.enemies); // Legacy for ultimates that may still use it
    this.registry.set('projectilesGroup', this.projectiles);
    this.registry.set('xpGemsGroup', this.xpGems);
    
    // Store individual enemy pools for collision setup
    this.registry.set('rattataPool', this.enemySpawner.getRattataPool());
    this.registry.set('geodudePool', this.enemySpawner.getGeodudePool());
    this.registry.set('zubatPool', this.enemySpawner.getZubatPool());
  }

  private setupInput(): void {
    // Keyboard input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      // Ultimate trigger (Space)
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  }

  private setupCollisions(): void {
    // Projectile hits enemy (all enemy pools via spawner)
    const enemyPools = [
      this.enemySpawner.getRattataPool(),
      this.enemySpawner.getGeodudePool(),
      this.enemySpawner.getZubatPool(),
    ];

    enemyPools.forEach((pool) => {
      this.physics.add.overlap(
        this.projectiles,
        pool,
        this.handleProjectileEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );

      // Enemy touches player
      this.physics.add.overlap(
        this.player,
        pool,
        this.handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );
    });

    // Legacy: keep old enemies group for backward compatibility with ultimates
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.handleProjectileEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Player collects XP gem
    this.physics.add.overlap(
      this.player,
      this.xpGems,
      this.handleXPCollection as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  private setupEventListeners(): void {
    // Listen for spawn-xp events from ultimates
    this.events.on('spawn-xp', (x: number, y: number) => {
      // Default to Tier 1 loot for generic events
      this.lootManager.drop(x, y, EnemyTier.TIER_1);
    });

    // Listen for spawn-aoe-damage events from weapons/ultimates
    this.events.on('spawn-aoe-damage', (x: number, y: number, radius: number, damage: number) => {
      this.applyAOEDamage(x, y, radius, damage);
    });

    // Listen for damage-enemy events
    this.events.on('damage-enemy', (enemy: Phaser.Physics.Arcade.Sprite, damage: number) => {
      this.damageEnemy(enemy, damage);
    });

    // Listen for HP updates from passives
    this.events.on('hp-update', (hp: number) => {
      this.characterState.currentHP = hp;
      this.callbacks.onHPUpdate(hp);
    });

    // Listen for enemy:death events from the new Enemy class
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

  private getCharacterContext(): CharacterContext {
    return {
      scene: this,
      player: this.player,
      stats: this.characterConfig.stats,
      currentHP: this.characterState.currentHP,
      level: this.characterState.level,
      xp: this.characterState.xp,
    };
  }

  private startTimers(): void {
    // Auto-fire using character's weapon cooldown
    this.fireTimer = this.time.addEvent({
      delay: this.characterState.activeWeapon.cooldownMs,
      callback: this.fireWeapon,
      callbackScope: this,
      loop: true,
    });

    // Start enemy spawner system
    this.enemySpawner.start();
  }

  private fireWeapon(): void {
    if (this.gameOver) return;

    // Check if player can control (disabled during some ultimates)
    if (this.player.getData('canControl') === false) return;

    const ctx = this.getCharacterContext();
    this.characterState.activeWeapon.fire(ctx);
  }

  private triggerUltimate(): void {
    if (this.gameOver) return;
    if (this.characterState.ultimateCooldownRemaining > 0) return;
    if (this.characterState.isUltimateActive) return;

    const ctx = this.getCharacterContext();
    const ultimate = this.characterConfig.ultimate;

    // Execute ultimate
    ultimate.execute(ctx);
    this.characterState.isUltimateActive = true;

    // Handle duration-based ultimates
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

    // Start cooldown
    this.characterState.ultimateCooldownRemaining = ultimate.cooldownMs;
  }

  private applyAOEDamage(x: number, y: number, radius: number, damage: number): void {
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (dist <= radius) {
        this.damageEnemy(enemy, damage);
      }
    });
  }

  private damageEnemy(enemy: Phaser.Physics.Arcade.Sprite, damage: number): void {
    // Apply Shadow Tag +25% damage bonus
    let finalDamage = damage;
    if (enemy.getData('shadowTagged')) {
      finalDamage = Math.floor(damage * 1.25);
    }

    // Check if this is a new Enemy class instance (has takeDamage method)
    if ('takeDamage' in enemy && typeof (enemy as any).takeDamage === 'function') {
      // Use the new Enemy class damage system
      (enemy as any).takeDamage(finalDamage);
      return;
    }

    // Legacy enemy handling (using getData)
    const currentHP = (enemy.getData('hp') as number) || 20;
    const newHP = currentHP - finalDamage;

    if (newHP <= 0) {
      // Check for Dream Eater heal
      if (enemy.getData('healOnKill') && enemy.getData('cursed')) {
        this.characterState.currentHP = Math.min(
          this.characterState.currentHP + 1,
          this.characterConfig.stats.maxHP
        );
        this.callbacks.onHPUpdate(this.characterState.currentHP);
      }

      // Spawn Exp Candy via LootManager
      const stats = ENEMY_STATS[enemy.getData('type') as EnemyType]; // Legacy support if type is stored
      if (stats) {
        this.lootManager.drop(enemy.x, enemy.y, stats.tier);
      } else {
        // Fallback for legacy mechanics without specific type
        // Assuming Tier 1 if unknown
        // Or if 'isBoss' flag is present
        if (enemy.getData('isBoss')) {
             // We need to import EnemyTier to use it, or just rely on drop
             // But we don't have EnemyTier imported in MainScene.
             // Best to just rely on enemy type if we can.
             // Legacy 'damageEnemy' handles standard enemies with no type? 
             // Actually 'enemy' objects usually have 'enemyType' property or 'type' data.
             // If this is legacy code, let's just minimal fix.
        }
      }
      enemy.setActive(false);
      enemy.setVisible(false);
    } else {
      enemy.setData('hp', newHP);
    }
  }

  private handleProjectileEnemyCollision(
    projectileObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const projectile = projectileObj as Phaser.Physics.Arcade.Sprite;
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    // Get damage from projectile data or default
    const damage = (projectile.getData('damage') as number) || this.characterConfig.stats.baseDamage;

    // Handle piercing projectiles
    const pierceCount = projectile.getData('pierceCount') as number;
    if (pierceCount && pierceCount > 0) {
      projectile.setData('pierceCount', pierceCount - 1);
    } else {
      projectile.setActive(false);
      projectile.setVisible(false);
      projectile.clearTint();
      projectile.setScale(1);
    }

    // Handle exploding projectiles
    if (projectile.getData('explodes')) {
      this.applyAOEDamage(enemy.x, enemy.y, 80, damage);
    }

    // Handle crit kill
    if (projectile.getData('critKill') && Math.random() < 0.2) {
      // 20% crit chance for instant kill
      this.damageEnemy(enemy, 9999);
    } else {
      this.damageEnemy(enemy, damage);
    }
  }



  /**
   * Cull excess Exp Candies when count exceeds threshold.
   * Destroys the 50 candies furthest from the player to maintain performance.
   */
  private cullExcessCandies(): void {
    const MAX_CANDIES = 300;
    const CULL_COUNT = 50;
    
    const activeCandies = this.xpGems.getChildren().filter(
      (child) => (child as Phaser.Physics.Arcade.Sprite).active
    ) as Phaser.Physics.Arcade.Sprite[];
    
    if (activeCandies.length <= MAX_CANDIES) return;
    
    // Sort by distance from player (furthest first)
    activeCandies.sort((a, b) => {
      const distA = Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y);
      const distB = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
      return distB - distA; // Descending order
    });
    
    // Cull the furthest candies
    for (let i = 0; i < CULL_COUNT && i < activeCandies.length; i++) {
      activeCandies[i].setActive(false);
      activeCandies[i].setVisible(false);
    }
  }

  private handleXPCollection(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    candyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const candy = candyObj as Phaser.Physics.Arcade.Sprite;
    
    // Prevent multiple triggers
    if (!candy.active) return;

    // key fix: disable body immediately to prevent overlap from firing again in the same frame
    candy.disableBody(true, true);
    candy.setActive(false);

    // Get XP value from candy tier
    const xpValue = (candy.getData('xpValue') as number) || 1;
    const lootType = candy.getData('lootType') as LootItemType;

    let canLevelUp = false;

    if (lootType === LootItemType.RARE_CANDY) {
      canLevelUp = this.experienceManager.addInstantLevel();
    } else {
      canLevelUp = this.experienceManager.addXP(xpValue);
    }
    
    // Sync experience manager state to character state for compatibility
    this.characterState.level = this.experienceManager.currentLevel;
    this.characterState.xp = this.experienceManager.currentXP;
    this.characterState.xpToNextLevel = this.experienceManager.xpToNextLevel;
    
    // Update score with XP gained
    this.score += xpValue;
    this.callbacks.onScoreUpdate(this.score);

    // Check if eligible for level up and not already processing one
    if (canLevelUp && !this.isLevelUpPending) {
      this.isLevelUpPending = true;
      
      // Process the FIRST level up step immediately
      this.experienceManager.processLevelUp();
      
      // Visual feedback for level up
      // Use callback to pause ONLY after flash fades out to prevent white screen freeze
      this.cameras.main.flash(500, 255, 255, 255, false, (_camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress === 1) {
          // Zombie Guard: If scene was destroyed (e.g. reload) during flash, abort.
          if (!this.sys || !this.sys.isActive()) return;

          // Check for weapon evolution
          const evolutionLevel = this.characterConfig.weapon.evolutionLevel ?? 5;
          if (!this.characterState.isEvolved && this.characterState.level >= evolutionLevel && this.characterConfig.weapon.evolution) {
            this.characterState.activeWeapon = this.characterConfig.weapon.evolution;
            this.characterState.isEvolved = true;
            
            // Update fire timer for new weapon cooldown
            this.fireTimer.remove();
            this.fireTimer = this.time.addEvent({
              delay: this.characterState.activeWeapon.cooldownMs,
              callback: this.fireWeapon,
              callbackScope: this,
              loop: true,
            });
          }
          
          // Show Level Up Menu
          this.showLevelUpMenu();
        }
      });
    }

    // Update level UI
    this.updateLevelUI();
  }

  /**
   * Sync character state with ExperienceManager and update UI events.
   */
  private updateLevelUI(): void {
    // Sync experience manager state to character state for compatibility
    this.characterState.level = this.experienceManager.currentLevel;
    this.characterState.xp = this.experienceManager.currentXP;
    this.characterState.xpToNextLevel = this.experienceManager.xpToNextLevel;

    if (this.callbacks.onLevelUpdate) {
      this.callbacks.onLevelUpdate(this.characterState.level, this.characterState.xp, this.characterState.xpToNextLevel);
    }
    
    // Emit xp-update event to window for React LevelBar component
    window.dispatchEvent(new CustomEvent('xp-update', {
      detail: {
        current: this.characterState.xp,
        max: this.characterState.xpToNextLevel,
        level: this.characterState.level,
      },
    }));
  }

  /**
   * Display the Level Up Menu overlay.
   * Handles pausing the scene and resuming (or showing next level up) on input.
   */
  private showLevelUpMenu(): void {
    // Pause scene and log placeholder message for level-up menu
    console.log('Level Up Menu Open');
    
    // Only pause if not already paused (avoid "Cannot pause non-running Scene" warning during recursion)
    if (this.sys.settings.status === Phaser.Scenes.RUNNING) {
      this.scene.pause();
    }
    
    // Ensure UI reflects current state
    this.updateLevelUI();
    
    // Show Level Up UI Overlay
    const width = this.scale.width;
    const height = this.scale.height;
    
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);
    overlay.setDepth(100);
    
    const levelUpText = this.add.text(width / 2, height / 2 - 20, 'LEVEL UP!', {
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(101);
    
    const continueText = this.add.text(width / 2, height / 2 + 40, 'Press ENTER to Continue', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(101);
    
    // Resume on ENTER press
    const resumeHandler = (e: KeyboardEvent) => {
      // Guard against zombie listeners from destroyed scenes (fixes queueOp error)
      if (!this.sys || !this.scene) {
        window.removeEventListener('keydown', resumeHandler);
        return;
      }

      if (e.code === 'Enter') {
         // Clean up UI
         overlay.destroy();
         levelUpText.destroy();
         continueText.destroy();
         
         // Remove listener
         window.removeEventListener('keydown', resumeHandler);
         // Remove shutdown hook since we handled it
         this.events.off('shutdown', cleanupHandler);
         this.events.off('destroy', cleanupHandler);
         
         // Check if we can level up again (for multi-level jumps)
         if (this.experienceManager.processLevelUp()) {
            // Recursively show menu again for next level
            this.showLevelUpMenu();
         } else {
            // Sequence complete
            this.isLevelUpPending = false;
            // Resume game
            this.scene.resume();
         }
      }
    };

    // Cleanup function to remove listener if scene is destroyed before Enter is pressed
    const cleanupHandler = () => {
       window.removeEventListener('keydown', resumeHandler);
    };
    
    // Register cleanup on scene shutdown/destroy
    this.events.once('shutdown', cleanupHandler);
    this.events.once('destroy', cleanupHandler);
    
    // Initial delay to prevent accidental inputs
    // Use setTimeout because this.time.delayedCall triggers on scene update, which is paused!
    window.setTimeout(() => {
       // Only attach if scene is still active
       if (this.sys && this.scene) {
          window.addEventListener('keydown', resumeHandler);
       }
    }, 500);
  }



  private handlePlayerEnemyCollision(
    _playerObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    if (this.isInvincible || this.gameOver) return;
    if (this.player.getData('invincible')) return;

    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    // Call passive onEnemyTouch if exists (e.g., Static)
    if (this.characterConfig.passive.onEnemyTouch) {
      const ctx = this.getCharacterContext();
      this.characterConfig.passive.onEnemyTouch(ctx, enemy);
    }

    // Destroy enemy
    enemy.setActive(false);
    enemy.setVisible(false);

    // Calculate damage (can be modified by passive)
    let damage = 20;
    if (this.characterConfig.passive.onDamageTaken) {
      const ctx = this.getCharacterContext();
      damage = this.characterConfig.passive.onDamageTaken(ctx, damage, 'normal');
    }

    // Handle Destiny Bond reflection
    if (this.player.getData('destinyBondActive')) {
      const linkedEnemies = this.player.getData('destinyBondedEnemies') as Phaser.Physics.Arcade.Sprite[] || [];
      linkedEnemies.forEach((linked) => {
        if (linked.active) {
          this.damageEnemy(linked, damage * 5); // 500% reflection
        }
      });
    }

    // Damage player
    this.characterState.currentHP -= damage;
    this.callbacks.onHPUpdate(this.characterState.currentHP);

    if (this.characterState.currentHP <= 0) {
      this.handleGameOver();
      return;
    }

    // Brief invincibility
    this.isInvincible = true;
    this.player.setAlpha(0.5);

    this.time.delayedCall(1000, () => {
      this.isInvincible = false;
      this.player.setAlpha(1);
    });
  }

  private handleGameOver(): void {
    this.gameOver = true;
    this.fireTimer.remove();
    this.enemySpawner.stop();
    this.player.setVelocity(0, 0);
    this.callbacks.onGameOver();
  }

  // Public method to receive joystick input from React
  public setJoystickVector(x: number, y: number): void {
    this.joystickVector.x = x;
    this.joystickVector.y = y;
  }

  update(_time: number, delta: number): void {
    if (this.gameOver) return;

    // Cull excess Exp Candies for performance (every 60 frames)
    this.cullFrameCounter++;
    if (this.cullFrameCounter >= 60) {
      this.cullFrameCounter = 0;
      this.cullExcessCandies();
    }

    // Update enemy spawner (handles wave progression)
    this.enemySpawner.update(delta);

    // Update ultimate cooldown
    if (this.characterState.ultimateCooldownRemaining > 0) {
      this.characterState.ultimateCooldownRemaining -= delta;
    }

    // Check for ultimate trigger
    if (this.spaceKey?.isDown) {
      this.triggerUltimate();
    }

    // Check if player can control movement
    const canControl = this.player.getData('canControl') !== false;

    // Handle Blastoise pinball mode
    if (this.player.getData('pinballMode')) {
      // Bounce off screen edges
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (this.player.x <= 0 || this.player.x >= this.scale.width) {
        body.velocity.x *= -1;
      }
      if (this.player.y <= 0 || this.player.y >= this.scale.height) {
        body.velocity.y *= -1;
      }

      // Damage enemies on contact during shell smash
      this.enemies.getChildren().forEach((child) => {
        const enemy = child as Phaser.Physics.Arcade.Sprite;
        if (!enemy.active) return;

        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        if (dist <= 40) {
          this.damageEnemy(enemy, this.characterConfig.stats.baseDamage * 2);
        }
      });
    }

    // Handle player movement (if can control)
    let velocityX = 0;
    let velocityY = 0;

    if (canControl) {
      // Keyboard input
      if (this.cursors?.left?.isDown || this.wasd?.A?.isDown) {
        velocityX -= 1;
      }
      if (this.cursors?.right?.isDown || this.wasd?.D?.isDown) {
        velocityX += 1;
      }
      if (this.cursors?.up?.isDown || this.wasd?.W?.isDown) {
        velocityY -= 1;
      }
      if (this.cursors?.down?.isDown || this.wasd?.S?.isDown) {
        velocityY += 1;
      }

      // Add joystick input
      velocityX += this.joystickVector.x;
      velocityY += this.joystickVector.y;

      // Normalize if diagonal
      const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      if (length > 1) {
        velocityX /= length;
        velocityY /= length;
      }

      // Apply speed (with possible multiplier from ultimates like Bone Rush)
      const speedMultiplier = (this.player.getData('speedMultiplier') as number) || 1;
      const speed = this.characterConfig.stats.speed * speedMultiplier;

      this.player.setVelocity(velocityX * speed, velocityY * speed);
    }

    // Update Lucario's orbiting bones
    const orbitingBones = this.player.getData('orbitingBones') as Phaser.GameObjects.Rectangle[];
    if (orbitingBones && orbitingBones.length > 0) {
      orbitingBones.forEach((bone) => {
        let angle = bone.getData('orbitAngle') as number;
        const radius = bone.getData('orbitRadius') as number;
        angle += 0.15; // Rotation speed
        bone.setData('orbitAngle', angle);
        bone.setPosition(
          this.player.x + Math.cos(angle) * radius,
          this.player.y + Math.sin(angle) * radius
        );
        bone.setRotation(angle);

        // Damage enemies touching bones
        this.enemies.getChildren().forEach((child) => {
          const enemy = child as Phaser.Physics.Arcade.Sprite;
          if (!enemy.active) return;

          const dist = Phaser.Math.Distance.Between(bone.x, bone.y, enemy.x, enemy.y);
          if (dist <= 20) {
            this.damageEnemy(enemy, this.characterConfig.stats.baseDamage);
          }
        });
      });
    }

    // Update player animation based on direction
    if (!this.usePlaceholderGraphics && canControl) {
      const isMoving = velocityX !== 0 || velocityY !== 0;
      const animState = isMoving ? 'walk' : 'idle';
      
      // Only update direction if moving
      if (isMoving) {
        const direction = getDirectionFromVelocity(velocityX, velocityY);
        if (direction !== this.currentDirection) {
          this.currentDirection = direction;
        }
      }
      
      // construct animation key: e.g. pikachu-walk-down or pikachu-idle-down
      const animKey = `${this.characterConfig.spriteKey}-${animState}-${this.currentDirection}`;
      this.player.play(animKey, true);
    }

    // Move enemies toward player
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      // Skip stunned enemies
      if (enemy.getData('stunned')) {
        enemy.setVelocity(0, 0);
        return;
      }

      const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );

      const enemySpeed = 80;
      const vx = Math.cos(angle) * enemySpeed;
      const vy = Math.sin(angle) * enemySpeed;
      enemy.setVelocity(vx, vy);

      // Update animation to face player (only when direction changes)
      if (!this.usePlaceholderGraphics) {
        const spriteName = enemy.getData('spriteName') as string;
        if (spriteName) {
          const newDirection = getDirectionFromVelocity(vx, vy);
          const currentDirection = enemy.getData('currentDirection') as string;
          
          if (newDirection !== currentDirection) {
            enemy.setData('currentDirection', newDirection);
            const animKey = `${spriteName}-walk-${newDirection}`;
            enemy.play(animKey);
          }
        }
      }
    });

    // Call passive onUpdate if exists
    if (this.characterConfig.passive.onUpdate) {
      const ctx = this.getCharacterContext();
      this.characterConfig.passive.onUpdate(ctx, delta);
    }
  }
}
