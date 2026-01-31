import type { Item } from './items/Item';
import { FloatingHpBar } from '../ui/FloatingHpBar';

export class Player extends Phaser.Physics.Arcade.Sprite {
  // Collection zone for XP gems (Magnet)
  public collectionZone: Phaser.GameObjects.Zone;

  // Modifiers
  public moveSpeedMultiplier = 1.0;
  public projectileSizeModifier = 1.0;

  // Inventory
  public items: Item[] = [];

  // Stats
  public health: number = 100;
  public maxHP: number = 100;
  public regen: number = 0;
  public defense: number = 0;
  public isInvulnerable: boolean = false;
  
  private regenTimer: number = 0;
  private hpBar: FloatingHpBar;
  
  // Invulnerability duration in ms
  private readonly INVULNERABILITY_DURATION = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

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
    
    // Initialize stats
    this.health = this.maxHP;
    this.regen = 0;
    this.defense = 0;
    
    this.items = [];

    // Initialize UI
    this.hpBar = new FloatingHpBar(scene, this);
    this.hpBar.draw(this.health, this.maxHP);
  }

  /**
   * Add an item to the player's inventory.
   * Handles acquiring new items or leveling up existing ones.
   */
  public addItem(item: Item): void {
    const existingItem = this.items.find(i => i.id === item.id);
    
    const ctx = {
        scene: this.scene,
        player: this,
        stats: { maxHP: this.maxHP, speed: 0, baseDamage: 0 }, // Stub stats if needed, or fetch real ones
        currentHP: this.health,
        level: 0, // Player level not strictly needed for item logic usually, or pass it if available
        xp: 0
    };

    if (existingItem) {
        // Upgrade existing
        existingItem.levelUp(ctx);
    } else {
        // Add new
        this.items.push(item);
        item.levelUp(ctx);
        console.log(`[Player] Acquired item: ${item.name}`);
    }
  }

  /**
   * Remove an item from the player's inventory by ID.
   * Reverts effects via item.onRemove().
   */
  public removeItem(itemId: string): void {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) return;

    const item = this.items[index];
    
    const ctx = {
        scene: this.scene,
        player: this,
        stats: { maxHP: this.maxHP, speed: 0, baseDamage: 0 },
        currentHP: this.health,
        level: 0,
        xp: 0
    };

    item.onRemove(ctx);
    this.items.splice(index, 1);
    console.log(`[Player] Removed item: ${item.name}`);
  }

  /**
   * Set the level of an item in the inventory.
   * Resets the item and re-applies upgrades to reach the target level.
   */
  public setItemLevel(itemId: string, targetLevel: number): void {
      console.log(`[Player] setItemLevel: setting ${itemId} to ${targetLevel}`);
      const item = this.items.find(i => i.id === itemId);
      if (!item) {
          console.warn(`[Player] setItemLevel: item ${itemId} not found`);
          return;
      }

      if (targetLevel < 1) targetLevel = 1;
      if (targetLevel > item.maxLevel) targetLevel = item.maxLevel;

      if (targetLevel === item.level) return;

      const ctx = {
          scene: this.scene,
          player: this,
          stats: { maxHP: this.maxHP, speed: 0, baseDamage: 0 },
          currentHP: this.health,
          level: 0,
          xp: 0
      };

      // 1. Remove current effects completely
      item.onRemove(ctx);

      // 2. Reset level
      item.level = 0;

      // 3. Level up to target
      while (item.level < targetLevel) {
          item.levelUp(ctx);
      }
      
      console.log(`[Player] Set item ${item.name} to Level ${targetLevel}`);
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
   * Applies damage, emits event, and triggers short invulnerability.
   */
  public takeDamage(amount: number): void {
    // 1. Check Immunity
    if (this.isInvulnerable) return;

    // 2. Apply Damage (mitigated by defense)
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

    // 3. Trigger Short Immunity
    this.isInvulnerable = true;
    
    // Visual Feedback: Red Tint + Flicker
    this.setTint(0xff0000);
    this.setAlpha(1); // Ensure start at 1

    // Stop existing tweens to prevent conflict
    this.scene.tweens.killTweensOf(this);

    this.scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 50, // 50ms fade out, 50ms fade in = 100ms total
        yoyo: true,
        repeat: 0, // Run exactly once to match 100ms invuln window
        onComplete: () => {
            this.clearTint();
            this.setAlpha(1);
        }
    });

    // Reset Immunity matches visual duration
    this.scene.time.delayedCall(this.INVULNERABILITY_DURATION, () => {
        this.isInvulnerable = false;
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
}

