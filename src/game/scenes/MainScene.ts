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
import type { CustomMapData } from '@/game/types/map';
import { Player } from '@/game/entities/Player';

// Specialized Systems
import { MapManager } from '@/game/systems/MapManager';
import { TextureManager } from '@/game/systems/TextureManager';
import { InputManager } from '@/game/systems/InputManager';
import { CombatManager } from '@/game/systems/CombatManager';
import { UIManager } from '@/game/systems/UIManager';
import { DevDebugSystem } from '@/game/systems/DevDebugSystem';
import { InventoryDisplay } from '@/game/ui/InventoryDisplay';

/** Extended Window interface for debugging */
declare global {
  interface Window {
    gameScene?: MainScene;
  }
}

/** Interface for grouping game loop state */
interface GameSessionState {
  score: number;
  survivalTime: number;
  lastTimeUpdate: number;
  gameOver: boolean;
  isLevelUpPending: boolean;
  currentDirection: DirectionName;
  usePlaceholderGraphics: boolean;
  cullFrameCounter: number;
}

export class MainScene extends Phaser.Scene {
  // Core Entities
  private player!: Player;
  private characterConfig!: CharacterConfig;
  private characterState!: CharacterState;

  // Systems
  private mapManager!: MapManager;
  private textureManager!: TextureManager;
  private inputManager!: InputManager;
  private combatManager!: CombatManager;
  private uiManager!: UIManager;
  public debugSystem!: DevDebugSystem;
  private experienceManager!: ExperienceManager;
  private enemySpawner!: EnemySpawner;
  private lootManager!: LootManager;

  // Groups
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private xpGems!: Phaser.Physics.Arcade.Group;
  private hazardGroup!: Phaser.Physics.Arcade.Group;

  // Timers & Callbacks
  private fireTimer!: Phaser.Time.TimerEvent;
  private callbacks!: GameCallbacks;
  
  // UI Elements
  private inventoryDisplay!: InventoryDisplay;

  // Session State
  private session: GameSessionState = {
    score: 0,
    survivalTime: 0,
    lastTimeUpdate: 0,
    gameOver: false,
    isLevelUpPending: false,
    currentDirection: 'down',
    usePlaceholderGraphics: false,
    cullFrameCounter: 0,
  };

  constructor() {
    super({ key: 'MainScene' });
  }

  /**
   * Scene Lifecycle: Create
   */
  public create(data?: { customMapData?: CustomMapData }): void {
    this.initializeEnvironment();
    this.initializeSystems(data);
    this.initializePlayerAndGroups(data);
    this.initializePhysicsCollisions();
    this.setupEventListeners();
    this.setupTimers();
    this.initializeUI();
    this.setupCamera(data);
  }

  private initializeEnvironment(): void {
    window.gameScene = this;
    this.callbacks = this.registry.get('callbacks') as GameCallbacks;
    
    const selectedCharacterId = this.registry.get('selectedCharacter') as string || 'pikachu';
    this.characterConfig = getCharacter(selectedCharacterId);
    this.characterState = createCharacterState(this.characterConfig);
    this.registry.set('characterState', this.characterState);

    const manifest = this.registry.get('spriteManifest') || [];
    this.session.usePlaceholderGraphics = manifest.length === 0;
  }

  private initializeSystems(data?: { customMapData?: CustomMapData }): void {
    this.mapManager = new MapManager(this);
    this.mapManager.create(data?.customMapData || this.registry.get('customMapData'));

    this.textureManager = new TextureManager(this);
    this.textureManager.createTextures();
    
    this.experienceManager = new ExperienceManager();
    this.inputManager = new InputManager(this);
  }

  private initializePlayerAndGroups(data?: { customMapData?: CustomMapData }): void {
    this.createPlayer(data);
    this.createGroups();

    this.lootManager = new LootManager(this.xpGems);
    this.uiManager = new UIManager(this, this.callbacks, this.experienceManager, this.characterState);

    this.combatManager = new CombatManager(
      this,
      this.player,
      this.characterConfig,
      this.characterState,
      this.lootManager,
      this.callbacks,
      () => this.session.gameOver,
      () => this.handleGameOver()
    );

    this.debugSystem = new DevDebugSystem(
      this,
      this.player,
      this.characterState,
      this.experienceManager,
      this.combatManager,
      this.uiManager,
      this.enemySpawner.getEnemyGroup() as Phaser.Physics.Arcade.Group,
      this.enemies,
      () => this.session.gameOver
    );
  }

  private createPlayer(data?: { customMapData?: CustomMapData }): void {
    const mapData = data?.customMapData || this.registry.get('customMapData') as CustomMapData | undefined;
    let spawnX = this.physics.world.bounds.centerX;
    let spawnY = this.physics.world.bounds.centerY;

    if (mapData?.spawnPoint) {
      spawnX = mapData.spawnPoint.x * mapData.tileSize + mapData.tileSize / 2;
      spawnY = mapData.spawnPoint.y * mapData.tileSize + mapData.tileSize / 2;
    }

    const spriteKey = this.session.usePlaceholderGraphics ? 'player' : this.characterConfig.spriteKey;
    this.player = new Player(this, spawnX, spawnY, spriteKey);
    this.player.setExperienceManager(this.experienceManager);
    this.player.setHealth(this.characterConfig.stats.maxHP, this.characterConfig.stats.maxHP);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);

    if (!this.session.usePlaceholderGraphics) {
      this.player.play(`${this.characterConfig.spriteKey}-idle-down`);
      this.player.setScale(2);
    }
  }

  private createGroups(): void {
    this.enemies = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 200 });
    this.enemySpawner = new EnemySpawner(this, this.player, this.experienceManager);
    this.projectiles = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 50 });
    this.xpGems = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 100 });
    this.hazardGroup = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 50 });

    this.registry.set('enemiesGroup', this.enemySpawner.getEnemyGroup());
    this.registry.set('legacyEnemiesGroup', this.enemies);
    this.registry.set('projectilesGroup', this.projectiles);
    this.registry.set('xpGemsGroup', this.xpGems);
    this.registry.set('hazardGroup', this.hazardGroup);
  }

  private initializePhysicsCollisions(): void {
    const objectsLayer = this.mapManager.getObjectsLayer();
    if (objectsLayer) {
      this.physics.add.collider(this.player, objectsLayer);
    }

    this.combatManager.setupCollisions(this.enemySpawner, this.projectiles, this.hazardGroup);

    this.physics.add.overlap(
      this.player,
      this.xpGems,
      this.handleXPCollection.bind(this) as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  private setupEventListeners(): void {
    this.events.on('spawn-xp', (x: number, y: number) => this.lootManager.drop(x, y, EnemyTier.TIER_1));

    this.events.on('spawn-aoe-damage', (x: number, y: number, radius: number, damage: number, isFinal = false) => {
      const finalDamage = isFinal ? damage : (damage * this.player.might);
      this.combatManager.applyAOEDamage(x, y, radius, finalDamage, this.enemies);
      this.combatManager.applyAOEDamage(x, y, radius, finalDamage, this.enemySpawner.getEnemyGroup() as Phaser.Physics.Arcade.Group);
    });

    this.events.on('damage-enemy', (enemy: Phaser.Physics.Arcade.Sprite, damage: number, isFinal = false) => {
      const finalDamage = isFinal ? damage : (damage * this.player.might);
      this.combatManager.damageEnemy(enemy, finalDamage);
    });

    this.events.on('hp-update', (hp: number) => { this.characterState.currentHP = hp; });
    this.events.on('player:heal', (amount: number) => this.combatManager.healPlayer(amount));

    this.events.on('enemy:death', (x: number, y: number, enemyType: EnemyType) => {
      const stats = ENEMY_STATS[enemyType];
      if (stats) this.lootManager.drop(x, y, stats.tier);
    });

    this.input.keyboard?.on('keydown-E', () => {
      if (!this.session.gameOver) this.scene.start('LevelEditorScene');
    });

    this.inputManager.setup(() => this.uiManager.togglePause(() => this.combatManager.healPlayer(0)));
    this.events.on('inventory-updated', () => this.updateInventoryUI());
  }

  private setupTimers(): void {
    this.restartMainWeaponTimer();
    this.enemySpawner.start();
    
    if (this.characterConfig.passive.onInit) {
      this.characterConfig.passive.onInit(this.getCharacterContext());
    }
  }

  private initializeUI(): void {
    this.callbacks.onScoreUpdate(this.session.score);
    this.uiManager.updateLevelUI();

    this.inventoryDisplay = new InventoryDisplay(this, 20, 80);
    this.inventoryDisplay.setScrollFactor(0).setDepth(100);
    this.updateInventoryUI();

    this.debugSystem.setMainWeaponTimerRef(
      () => this.fireTimer,
      (t) => { this.fireTimer = t; }
    );
  }

  private setupCamera(data?: { customMapData?: CustomMapData }): void {
    const viewportWidth = this.scale.width;
    const viewportHeight = this.scale.height;
    
    const mapData = data?.customMapData || this.registry.get('customMapData') as CustomMapData | undefined;
    const mapW = mapData ? mapData.width * mapData.tileSize : 3200;
    const mapH = mapData ? mapData.height * mapData.tileSize : 3200;

    const camX = mapW < viewportWidth ? -(viewportWidth - mapW) / 2 : 0;
    const camY = mapH < viewportHeight ? -(viewportHeight - mapH) / 2 : 0;
    const camW = mapW < viewportWidth ? viewportWidth : mapW;
    const camH = mapH < viewportHeight ? viewportHeight : mapH;

    this.cameras.main.setBounds(camX, camY, camW, camH);
    this.cameras.main.centerOn(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }

  public updateInventoryUI(): void {
    if (this.player && this.inventoryDisplay) {
      this.inventoryDisplay.refresh(this.player);
    }
  }

  private handleGameOver(): void {
    this.session.gameOver = true;
    this.uiManager.setGameOver(true);
    if (this.fireTimer) this.fireTimer.remove();
    this.enemySpawner.stop();
    this.player.setVelocity(0, 0);
    this.callbacks.onGameOver();
    
    this.physics.pause();
    this.anims.pauseAll();
    this.tweens.pauseAll();
    this.time.paused = true;
  }

  private handleXPCollection(
    _playerObj: unknown,
    candyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const candy = candyObj as Phaser.Physics.Arcade.Sprite;
    if (!candy.active) return;

    candy.disableBody(true, true);
    candy.setActive(false);

    const xpValue = (candy.getData('xpValue') as number) || 1;
    const isRareCandy = candy.getData('lootType') === 'rare-candy'; 

    const canLevelUp = isRareCandy 
      ? this.experienceManager.addInstantLevel() 
      : this.player.gainExperience(xpValue);
    
    this.session.score += xpValue;
    this.callbacks.onScoreUpdate(this.session.score);
    this.uiManager.updateLevelUI();
    this.updateInventoryUI();

    if (canLevelUp) {
      this.player.checkAndApplyEvolution(this.experienceManager.currentLevel);
      if (!this.session.isLevelUpPending) {
        this.startLevelUpSequence();
      }
    }
  }

  public startLevelUpSequence(): void {
    if (this.session.isLevelUpPending) return;
    
    this.session.isLevelUpPending = true;
    this.uiManager.setLevelUpPending(true);
    
    this.cameras.main.flash(500, 255, 255, 255, false, (_camera: unknown, progress: number) => {
      if (progress === 1 && this.sys?.isActive()) {
        const activeWeaponIds = this.debugSystem.getActiveWeaponIds?.() || [];
        this.scene.pause('MainScene');
            
        this.scene.launch('LevelUpScene', {
          player: this.player,
          characterState: this.characterState,
          activeWeaponIds,
          onComplete: () => {
            this.scene.resume('MainScene');
            this.experienceManager.processLevelUp();

            this.session.isLevelUpPending = false;
            if (this.experienceManager.hasPendingLevelUp) {
              this.startLevelUpSequence();
            } else {
              this.uiManager.setLevelUpPending(false);
            }
          },
          onWeaponUpgrade: () => this.handleWeaponLevelUp(),
          onNewWeapon: (config: WeaponConfig) => this.handleNewWeapon(config)
        });
      }
    });
  }

  private handleWeaponLevelUp(): void {
    this.characterState.weaponLevel++;
    this.applyWeaponEvolution();
    this.updateInventoryUI();
  }

  public applyWeaponEvolution(): void {
    const evolutionLevel = this.characterConfig.weapon.evolutionLevel ?? 5;
    const currentWeaponLevel = this.characterState.weaponLevel;

    if (!this.characterState.isEvolved && currentWeaponLevel >= evolutionLevel && this.characterConfig.weapon.evolution) {
      this.characterState.activeWeapon = this.characterConfig.weapon.evolution;
      this.characterState.isEvolved = true;
      this.restartMainWeaponTimer();
    } else if (this.characterState.isEvolved && currentWeaponLevel < evolutionLevel) {
      this.characterState.activeWeapon = this.characterConfig.weapon;
      this.characterState.isEvolved = false;
      this.restartMainWeaponTimer();
    }
  }

  public restartMainWeaponTimer(): void {
    if (this.fireTimer) this.fireTimer.remove();
    this.fireTimer = this.time.addEvent({
      delay: this.characterState.activeWeapon.cooldownMs,
      callback: () => this.fireWeapon(),
      callbackScope: this,
      loop: true,
    });
  }

  private handleNewWeapon(config: WeaponConfig): void {
    this.debugSystem.debugAddWeapon(config, this.session.gameOver);
    this.updateInventoryUI();
  }

  public setJoystickVector(x: number, y: number): void {
    this.inputManager.setJoystickVector(x, y);
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

  private fireWeapon(): void {
    if (this.session.gameOver || this.player.getData('canControl') === false) return;
    const ctx = this.getCharacterContext();
    const weaponCtx = { ...ctx, level: Math.min(ctx.level, 8) };
    this.characterState.activeWeapon.fire(weaponCtx);
  }

  private triggerUltimate(): void {
    if (this.session.gameOver || this.characterState.ultimateCooldownRemaining > 0 || this.characterState.isUltimateActive) return;

    const ctx = this.getCharacterContext();
    const ultimate = this.characterConfig.ultimate;

    ultimate.execute(ctx);
    this.characterState.isUltimateActive = true;

    if (ultimate.durationMs && ultimate.durationMs > 0) {
      this.time.delayedCall(ultimate.durationMs, () => {
        if (ultimate.onEnd) ultimate.onEnd(this.getCharacterContext());
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
      level: this.characterState.weaponLevel,
      xp: this.characterState.xp,
    };
  }

  /**
   * Scene Lifecycle: Update
   */
  public update(_time: number, delta: number): void {
    if (this.session.gameOver || this.time.paused) return;

    this.updateGameTime(delta);
    this.updateMapAndSpawner(delta);
    this.handleInputAndMovement(delta);
    this.updateEntities(delta);
    this.handlePassives(delta);
  }

  private updateGameTime(delta: number): void {
    this.session.survivalTime += delta;
    if (this.session.survivalTime - this.session.lastTimeUpdate >= 1000) {
      this.session.lastTimeUpdate = this.session.survivalTime;
      this.callbacks.onTimeUpdate?.(this.session.survivalTime);
    }

    this.session.cullFrameCounter++;
    if (this.session.cullFrameCounter >= 60) {
      this.session.cullFrameCounter = 0;
      this.cullExcessCandies();
    }
  }

  private updateMapAndSpawner(delta: number): void {
    this.mapManager.update(delta);
    this.enemySpawner.update(delta);
  }

  private handleInputAndMovement(_delta: number): void {
    if (this.inputManager.isUltimateTriggered()) this.triggerUltimate();

    const canControl = this.player.getData('canControl') !== false;
    let finalVelocity = { x: 0, y: 0 };

    if (canControl) {
      const inputVector = this.inputManager.getMovementVector();
      const speed = this.player.characterConfig.stats.speed * this.player.moveSpeedMultiplier;
      finalVelocity = { x: inputVector.x * speed, y: inputVector.y * speed };
      this.player.setVelocity(finalVelocity.x, finalVelocity.y);
    }

    this.updatePlayerAnimations(finalVelocity, canControl);
  }

  private updatePlayerAnimations(velocity: { x: number, y: number }, canControl: boolean): void {
    if (this.session.usePlaceholderGraphics || !canControl) return;

    const isMoving = velocity.x !== 0 || velocity.y !== 0;
    const animState = isMoving ? 'walk' : 'idle';

    if (isMoving) {
      const direction = getDirectionFromVelocity(velocity.x, velocity.y);
      if (direction.includes('left')) this.player.setData('horizontalFacing', 'left');
      else if (direction.includes('right')) this.player.setData('horizontalFacing', 'right');
      
      if (direction !== this.session.currentDirection) {
        this.session.currentDirection = direction;
        this.player.setData('facingDirection', direction);
      }
    }

    this.player.play(`${this.player.characterConfig.spriteKey}-${animState}-${this.session.currentDirection}`, true);
  }

  private updateEntities(_delta: number): void {
    // Enemy AI & Gem Magnetism
    this.enemySpawner.getEnemyGroup().getChildren().forEach(child => this.updateEnemyAI(child as Phaser.Physics.Arcade.Sprite));
    this.xpGems.getChildren().forEach(child => this.updateGemMagnetism(child as Phaser.Physics.Arcade.Sprite));
    
    if (this.characterState.ultimateCooldownRemaining > 0) {
      this.characterState.ultimateCooldownRemaining -= _delta;
    }
  }

  private updateEnemyAI(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (!enemy.active || enemy.getData('stunned') || (enemy as any).isKnockedBack) {
      if (enemy.active && enemy.getData('stunned')) enemy.setVelocity(0, 0);
      return;
    }

    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
    const vx = Math.cos(angle) * 80;
    const vy = Math.sin(angle) * 80;
    enemy.setVelocity(vx, vy);

    if (!this.session.usePlaceholderGraphics) {
      const spriteName = enemy.getData('spriteName');
      if (spriteName) {
        const dir = getDirectionFromVelocity(vx, vy);
        if (dir !== enemy.getData('currentDirection')) {
          enemy.setData('currentDirection', dir);
          enemy.play(`${spriteName}-walk-${dir}`);
        }
      }
    }
  }

  private updateGemMagnetism(gem: Phaser.Physics.Arcade.Sprite): void {
    if (!gem.active) return;
    if (!gem.getData('isMagnetized')) {
      if (Phaser.Math.Distance.Between(gem.x, gem.y, this.player.x, this.player.y) <= this.player.magnetRadius) {
        gem.setData('isMagnetized', true);
      }
    }
    if (gem.getData('isMagnetized')) {
      const angle = Phaser.Math.Angle.Between(gem.x, gem.y, this.player.x, this.player.y);
      gem.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
    }
  }

  private handlePassives(delta: number): void {
    if (this.characterConfig.passive.onUpdate) {
      this.characterConfig.passive.onUpdate(this.getCharacterContext(), delta);
    }
  }

  private cullExcessCandies(): void {
    const MAX_CANDIES = 300;
    const CULL_COUNT = 50;
    const activeCandies = (this.xpGems.getChildren() as Phaser.Physics.Arcade.Sprite[]).filter(c => c.active);
    
    if (activeCandies.length <= MAX_CANDIES) return;
    
    activeCandies.sort((a, b) => 
      Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y) - 
      Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y)
    );
    
    for (let i = 0; i < CULL_COUNT && i < activeCandies.length; i++) {
      activeCandies[i].setActive(false).setVisible(false);
    }
  }
}