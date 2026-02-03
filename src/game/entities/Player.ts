import type { Item } from '@/game/entities/items/Item';
import { FloatingHpBar } from '@/game/ui/FloatingHpBar';
import { PlayerInventory } from './components/PlayerInventory';
import { getCharacter } from '@/game/entities/characters/registry';
import type { CharacterConfig } from '@/game/entities/characters/types';
import { ExperienceManager } from '@/game/systems/ExperienceManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  // Collection zone for XP gems (Magnet)
  public collectionZone: Phaser.GameObjects.Zone;

  // Modifiers
  public moveSpeedMultiplier = 1.0;
  public projectileSizeModifier = 1.0;
  public growth: number = 1.0;
  public baseMagnetRadius = 50;
  public magnetRadius = 50;
  private magnetRangeGraphic!: Phaser.GameObjects.Graphics;

  // Inventory Component
  public inventory: PlayerInventory;
  
  // Public getter for backward compatibility (DevDebugSystem etc.)
  public get items(): Item[] {
      return this.inventory.items;
  }
  // Setter to allow array assignment if necessary (though discouraged), 
  // or better, we just rely on inventory.items mutation.
  // Ideally we don't need a setter if no one assigns player.items = [].
  // Checking original code: `this.items = []` in constructor.
  
  // Stats
  public health: number = 100;
  public maxHP: number = 100;
  public regen: number = 0;
  public defense: number = 0;
  public amount: number = 0; // Projectile Amount Modifier
  public might: number = 1.0;
  public greed: number = 1.0;
  public gold: number = 0;
  public evolutionStage: number = 0;
  public formId: string = 'pikachu';
  public isInvulnerable: boolean = false; // Legacy: kept for debug console compatibility
  
  private experienceManager!: ExperienceManager;
  
  private regenTimer: number = 0;
  private hpBar: FloatingHpBar;

  // Configuration
  public characterConfig: CharacterConfig;

  /**
   * Expose unified stats object for damage calculations.
   * Merges mutable player state with static config.
   */
  public get stats(): CharacterConfig['stats'] {
      return {
          ...this.characterConfig.stats,
          maxHP: this.maxHP,
          // Use current mutable stats over config defaults
          might: this.might,
          defense: this.defense,
      };
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    // Initial Config Load (using texture key as ID for now, or fallback)
    // NOTE: This assumes texture key matches character ID. 
    // If not, we should probably pass ID to constructor or inferred.
    // Given usage in MainScene: new Player(this, centerX, centerY, spriteKey)
    // And spriteKey is 'pikachu' or 'raichu'...
    try {
        this.characterConfig = getCharacter(texture);
    } catch (e) {
        console.warn(`[Player] Could not load config for ${texture}, checking registry keys...`);
        // Fallback or re-throw? 
        // For safety, let's grab 'pikachu' if specific fails, or error out.
        this.characterConfig = getCharacter('pikachu');
    }

    // Initialize Inventory
    this.inventory = new PlayerInventory(this);

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body (Hitbox)
    this.setCollideWorldBounds(true);
    this.setDepth(10);
    // Make hitbox smaller than visual if needed, but default is fine for now
    // this.setBodySize(20, 20); 

    // Initialize collection zone (Magnet)
    // We use a Zone so it can have its own physics body separate from the player's hitbox
    this.collectionZone = scene.add.zone(x, y, 100, 100);
    this.collectionZone.setOrigin(0.5, 0.5); // Ensure zone is centered on coordinates
    scene.physics.add.existing(this.collectionZone);
    
    // Set circle physics body for the zone (Radius 50)
    const body = this.collectionZone.body as Phaser.Physics.Arcade.Body;
    body.setCircle(50);

    // Initialize Magnet Range Graphic
    this.magnetRangeGraphic = scene.add.graphics();
    this.magnetRangeGraphic.setVisible(false);
    this.magnetRangeGraphic.setDepth(5); // Below player
    
    // Initialize stats
    this.health = this.maxHP;
    this.regen = 0;
    this.defense = 0;
    
    // inventory init in constructor above

    // Initialize UI
    this.hpBar = new FloatingHpBar(scene, this);
    this.hpBar.draw(this.health, this.maxHP);
  }

  /**
   * Inject experience manager reference.
   */
  public setExperienceManager(manager: ExperienceManager): void {
      this.experienceManager = manager;
  }

  /**
   * Add an item to the player's inventory.
   * Delegates to PlayerInventory.
   */
  public addItem(item: Item): void {
      this.inventory.addItem(item);
      this.recalculateStats();
  }

  /**
   * Remove an item from the player's inventory by ID.
   * Delegates to PlayerInventory.
   */
  public removeItem(itemId: string): void {
      this.inventory.removeItem(itemId);
      this.recalculateStats();
  }

  /**
   * Set the level of an item in the inventory.
   * Delegates to PlayerInventory.
   */
  public setItemLevel(itemId: string, targetLevel: number): void {
      this.inventory.setItemLevel(itemId, targetLevel);
      this.recalculateStats();
  }

  /**
   * Initialize player stats (called by Game Scene usually, or relies on defaults)
   */
  public setHealth(current: number, max: number): void {
    this.health = current;
    this.maxHP = max;
    this.hpBar.draw(this.health, this.maxHP);
  }

  /**
   * Toggle the visibility of the magnet range visualization.
   */
  public setMagnetRangeVisible(visible: boolean): void {
      if (this.magnetRangeGraphic) {
          this.magnetRangeGraphic.setVisible(visible);
      }
  }

  /**
   * Increase (or decrease) Max HP.
   * Emits 'max-hp-change'.
   */
  public addMaxHP(amount: number): void {
      this.maxHP += amount;
      this.scene.events.emit('max-hp-change', this.maxHP);
      this.hpBar.draw(this.health, this.maxHP);
  }

  /**
   * Heal the player by a specific amount.
   * Caps at maxHP and emits 'hp-update'.
   */
  public heal(amount: number, showValue: boolean = true): void {
    if (this.health >= this.maxHP) return;

    this.health += amount;
    if (this.health > this.maxHP) this.health = this.maxHP;

    this.scene.events.emit('hp-update', this.health);
    this.hpBar.draw(this.health, this.maxHP);
    
    // Visual feedback
    // If showValue is true: show "+{amount}"
    // If showValue is false: show "+" (Healing Cross)
    const text = showValue ? `+${Math.floor(amount)}` : '+';
    
    const popup = this.scene.add.text(this.x, this.y - 20, text, {
        fontSize: '16px',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5).setDepth(200);

    this.scene.tweens.add({
        targets: popup,
        y: popup.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => popup.destroy()
    });
  }

  /**
   * Handle taking damage from enemies.
   * Applies damage and triggers visual feedback.
   * NOTE: Invulnerability is now handled per-enemy in CombatManager.
   */
  public takeDamage(amount: number): void {
    // Apply Damage (mitigated by defense)
    // Formula: Effective HP multiplier
    // damage = amount * (1 / (1 + def * 0.1))
    const mitigationFactor = 1 / (1 + (this.defense * 0.1));
    const finalDamage = amount * mitigationFactor;
    
    // Apply float damage to health
    this.health -= finalDamage;
    if (this.health < 0) this.health = 0;
    
    // Emit health change event for UI (Rounded up for clean display)
    this.scene.events.emit('hp-update', Math.ceil(this.health));
    this.hpBar.draw(this.health, this.maxHP);

    console.log(`[Player] Took ${finalDamage.toFixed(2)} damage (Raw: ${amount}, Def: ${this.defense}, Factor: ${mitigationFactor.toFixed(2)}). HP: ${this.health.toFixed(2)}`);

    // Visual Feedback: Red Tint + Flicker (cosmetic only, does NOT block damage)
    this.setTint(0xff0000);
    this.setAlpha(1);

    // Stop existing tweens to prevent conflict
    this.scene.tweens.killTweensOf(this);

    this.scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 50,
        yoyo: true,
        repeat: 0,
        onComplete: () => {
            this.clearTint();
            this.setAlpha(1);
        }
    });
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    // Sync UI
    if (this.hpBar) {
      this.hpBar.update();
    }

    // Regen Logic (Tick every 1s)
    if (this.regen > 0 && time > this.regenTimer + 1000) {
        this.heal(this.regen, false);
        this.regenTimer = time;
    }
    
    // Sync collection zone with player position
    if (this.collectionZone) {
      this.collectionZone.setPosition(this.x, this.y);
    }

    // Update Magnet Range Graphic
    if (this.magnetRangeGraphic && this.magnetRangeGraphic.visible) {
        this.magnetRangeGraphic.clear();
        this.magnetRangeGraphic.lineStyle(2, 0x00ff00, 0.5);
        this.magnetRangeGraphic.strokeCircle(this.x, this.y, this.magnetRadius);
    }
  }

  destroy(fromScene?: boolean): void {
    if (this.hpBar) {
      this.hpBar.destroy();
    }
    if (this.collectionZone) {
      this.collectionZone.destroy();
    }
    super.destroy(fromScene);
  }
  /**
   * Check if player meets evolution criteria and apply it.
   * @param level Current player level
   * @returns true if evolution occurred, false otherwise.
   */
  public checkAndApplyEvolution(level: number): boolean {
      // Step 1: Check Config Logic
      const evolution = this.characterConfig.evolution;
      
      // If no evolution configured
      if (!evolution) {
          // Limit Break: Only at specific milestones (Level 20, 40)
          if (level === 20 || level === 40) {
              this.applyLimitBreak();
              return true; // Return true to indicate boost applied
          }
          return false;
      }

      // If evolution configured but level not met
      if (level < evolution.level) {
          return false;
      }

      // Step 2: Retrieve New Form
      const newFormId = evolution.targetFormId;
      let newConfig;
      
      try {
        newConfig = getCharacter(newFormId);
      } catch (e) {
        console.warn(`[Evolution] Target form '${newFormId}' not found in registry.`);
        return false;
      }

      // Step 3: Apply Evolution
      console.log(`[Evolution] Evolving from ${this.formId} to ${newFormId}!`);
      
      // Update References
      this.characterConfig = newConfig;
      this.formId = newConfig.id;
      
      // Update Visuals
      this.setTexture(newConfig.spriteKey); 
      this.play(`${newConfig.spriteKey}-idle-down`);
      
      // Update Stats
      this.maxHP = newConfig.stats.maxHP;
      // Speed is handled by MainScene reading characterConfig
      this.might = newConfig.stats.might || 1.0;
      this.defense = newConfig.stats.defense || 0;
      
      this.healFull();
      
      // Visual Feedback (Tween)
      if (this.scene) {
          const originalScale = this.scaleX; // Should be 2 usually
          this.scene.tweens.add({
              targets: this,
              scaleX: originalScale * 1.5,
              scaleY: originalScale * 1.5,
              yoyo: true,
              duration: 300,
              repeat: 1,
              onComplete: () => {
                  this.setScale(originalScale); 
              }
          });
          
           // Flash effect configuration
           this.scene.tweens.add({
               targets: this,
               alpha: 0,
               duration: 100,
               yoyo: true,
               repeat: 3
           });
      }

      // Step 4: Cleanup
      this.evolutionStage++;
      return true;
  }

  /**
   * Fully heal the player.
   */
  public healFull(): void {
      this.health = this.maxHP;
      this.hpBar.draw(this.health, this.maxHP);
      this.scene.events.emit('hp-update', this.health);
  }

  /**
   * Recalculate player stats based on base stats and active items.
   */
  public recalculateStats(): void {
      // 1. Reset to Base Stats (Character defaults)
      // We use baseStats from config or current values as fallback
      const baseMight = this.characterConfig.stats.might || 1.0;
      this.might = baseMight;
      
      // 2. Add Evolution/Level Break Bonuses
      // Note: evolutionStage is tracked, but boosts were applied directly in checkAndApplyEvolution.
      // For a more robust system, we should track total bonuses separately.
      // However, following the user's logic exactly:
      // const muscleBandLevel = this.inventory.getItemLevel('muscle_band');
      
      // 3. Loop through Inventory and apply Passives
      const muscleBandLevel = this.inventory.getItemLevel('muscle_band');
      if (muscleBandLevel > 0) {
          // Apply 0.10 per level
          this.might += (muscleBandLevel * 0.10);
      }

      // Loaded Dice (Amount)
      this.amount = 0; // Reset
      const diceLevel = this.inventory.getItemLevel('loaded_dice');
      if (diceLevel > 0) {
          this.amount += diceLevel; // +1 per level
      }

      // Lucky Egg (Growth)
      this.growth = 1.0; // Reset
      const eggLevel = this.inventory.getItemLevel('lucky_egg');
      if (eggLevel > 0) {
          this.growth += (eggLevel * 0.10); // +10% per level
      }

      // Amulet Coin (Greed)
      this.greed = 1.0; // Reset
      const coinLevel = this.inventory.getItemLevel('amulet_coin');
      if (coinLevel > 0) {
          this.greed += (coinLevel * 0.20); // +20% per level
      }

      // Magnet (Pickup Range)
      let magnetBonus = 1.0;
      const magnetLevel = this.inventory.getItemLevel('magnet');
      if (magnetLevel > 0) {
          magnetBonus += (magnetLevel * 0.30); // +30% per level
      }
      this.magnetRadius = this.baseMagnetRadius * magnetBonus;

      // HP Up (Max HP)
      const hpUpLevel = this.inventory.getItemLevel('hp_up');
      if (hpUpLevel > 0) {
          const hpBonus = hpUpLevel * 20;
          this.maxHP = (this.characterConfig.stats.maxHP || 100) + hpBonus;
      } else {
          this.maxHP = this.characterConfig.stats.maxHP || 100;
      }
      this.hpBar.draw(this.health, this.maxHP);

      // Iron (Defense)
      const ironLevel = this.inventory.getItemLevel('iron');
      const baseDefense = this.characterConfig.stats.defense || 0;
      if (ironLevel > 0) {
          this.defense = baseDefense + ironLevel;
      } else {
          this.defense = baseDefense;
      }

      // Leftovers (Regen)
      const leftoversLevel = this.inventory.getItemLevel('leftovers');
      if (leftoversLevel > 0) {
          this.regen = leftoversLevel; // 1 HP per second per level
      } else {
          this.regen = 0;
      }

      // Update Physics Body
      if (this.collectionZone && this.collectionZone.body) {
          const body = this.collectionZone.body as Phaser.Physics.Arcade.Body;
          body.setCircle(this.magnetRadius);
      }

      console.log(`Stats Recalculated: Might ${(this.might * 100).toFixed(0)}%, Growth ${(this.growth * 100).toFixed(0)}%, Greed ${(this.greed * 100).toFixed(0)}%, Magnet Radius ${this.magnetRadius.toFixed(0)}px`);
  }

  /**
   * Add XP to the player, applying growth multiplier.
   * Logic: amount * growth
   */
  public gainExperience(amount: number): boolean {
      const finalAmount = amount * (this.growth || 1.0);
      if (!this.experienceManager) {
          console.warn("[Player] ExperienceManager not set! Cannot gain XP.");
          return false;
      }
      return this.experienceManager.addXP(finalAmount);
  }

  /**
   * Add Gold to the player, applying greed multiplier.
   * Logic: Math.ceil(amount * greed)
   */
  public gainGold(amount: number): void {
      const finalAmount = Math.ceil(amount * (this.greed || 1.0));
      this.gold += finalAmount;
      
      // Emit event for UI or systems tracking gold
      this.scene.events.emit('update-gold', this.gold);
      
      console.log(`[Player] Gained ${finalAmount} gold (Base: ${amount}, Greed: ${this.greed}). Total: ${this.gold}`);
  }

    // Limit Break: Small incremental boost for fully evolved characters
    private applyLimitBreak(): void {
        const hpBoost = 150;
        const mightBoost = 0.75; // +75% Might
        const defenseBoost = 3;

        // Apply
        this.maxHP += hpBoost;
        this.heal(this.maxHP); // Heal to full as per spec
        this.might += mightBoost;
        this.defense += defenseBoost;

        // Visual Feedback
        if (this.scene) {
             const floatingText = this.scene.add.text(this.x, this.y - 40, "LIMIT BREAK!", {
                 fontSize: '16px',
                 color: '#FFD700',
                 stroke: '#000000',
                 strokeThickness: 3
             }).setOrigin(0.5);
             
             this.scene.tweens.add({
                 targets: floatingText,
                 y: this.y - 80,
                 alpha: 0,
                 duration: 1000,
                 onComplete: () => floatingText.destroy()
             });

             // Small white flash
             this.scene.tweens.add({
                targets: this,
                tint: 0xFFFFFF,
                duration: 100,
                yoyo: true,
                onComplete: () => this.clearTint()
            });
        }
        
        console.log(`[Level Break] Power Up! HP+${hpBoost}, Might+${(mightBoost * 100).toFixed(0)}%, Def+${defenseBoost}`);
    }
}


