import type { Item } from './items/Item';

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
        item.onAcquire(ctx);
        console.log(`[Player] Acquired item: ${item.name}`);
    }
  }

  /**
   * Initialize player stats (called by Game Scene usually, or relies on defaults)
   */
  public setHealth(current: number, max: number): void {
    this.health = current;
    this.maxHP = max;
  }

  /**
   * Heal the player by a specific amount.
   * Caps at maxHP and emits 'health-change'.
   */
  public heal(amount: number): void {
    if (this.health >= this.maxHP) return;

    this.health += amount;
    if (this.health > this.maxHP) this.health = this.maxHP;

    this.scene.events.emit('health-change', this.health);
    
    // Visual feedback for healing (Green text)
    const popup = this.scene.add.text(this.x, this.y - 20, `+${Math.floor(amount)}`, {
        fontSize: '16px',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);

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
    const mitigatedDamage = Math.max(1, amount - this.defense);
    this.health -= mitigatedDamage;
    if (this.health < 0) this.health = 0;
    
    // Emit health change event for UI
    this.scene.events.emit('health-change', this.health);

    console.log(`[Player] Took ${amount} damage (Def: ${this.defense}, Final: ${mitigatedDamage}). HP: ${this.health}`);

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

    // Regen Logic (Tick every 1s)
    if (this.regen > 0 && time > this.regenTimer + 1000) {
        this.heal(this.regen);
        this.regenTimer = time;
    }
    
    // Sync collection zone with player position
    if (this.collectionZone) {
      this.collectionZone.setPosition(this.x, this.y);
    }
  }
}
