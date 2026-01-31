/**
 * LevelUpScene - Level Up Selection UI
 * 
 * A parallel Phaser scene that displays selection cards
 * when the player levels up.
 */
import Phaser from 'phaser';
import { Player } from '@/game/entities/Player';
import { LevelUpManager, type LevelUpOption } from '@/game/systems/LevelUpManager';
import type { CharacterState, WeaponConfig } from '@/game/entities/characters/types';

interface LevelUpSceneData {
  player: Player;
  characterState: CharacterState | null;
  activeWeaponIds?: string[];  // IDs of weapons player already has (excluding main)
  onComplete: () => void;
  onWeaponUpgrade?: () => void;
  onNewWeapon?: (config: WeaponConfig) => void;
}

export class LevelUpScene extends Phaser.Scene {
  private player!: Player;
  private characterState: CharacterState | null = null;
  private activeWeaponIds: string[] = [];
  private onComplete!: () => void;
  private onWeaponUpgrade?: () => void;
  private onNewWeapon?: (config: WeaponConfig) => void;
  private options: LevelUpOption[] = [];
  private cardContainer!: Phaser.GameObjects.Container;
  
  // Card styling constants
  private readonly CARD_WIDTH = 180;
  private readonly CARD_HEIGHT = 220;
  private readonly CARD_SPACING = 20;
  private readonly CARD_COLOR = 0x2c3e50;
  private readonly CARD_HOVER_COLOR = 0x34495e;
  private readonly CARD_BORDER_COLOR = 0xecf0f1;
  private readonly NEW_BADGE_COLOR = 0x27ae60;
  private readonly UPGRADE_BADGE_COLOR = 0x3498db;
  private readonly WEAPON_BADGE_COLOR = 0xe67e22;
  private readonly NEW_WEAPON_BADGE_COLOR = 0x9b59b6;  // Purple for new weapons
  
  constructor() {
    super({ key: 'LevelUpScene' });
  }
  
  init(data: LevelUpSceneData): void {
    this.player = data.player;
    this.characterState = data.characterState;
    this.activeWeaponIds = data.activeWeaponIds || [];
    this.onComplete = data.onComplete;
    this.onWeaponUpgrade = data.onWeaponUpgrade;
    this.onNewWeapon = data.onNewWeapon;
  }
  
  create(): void {
    const { width, height } = this.scale;
    
    // Note: The game should already be paused by the caller (MainScene or DevConsole)
    // We don't pause/resume here to avoid conflicts with DevConsole state
    console.log('[LevelUpScene] Created');
    
    // 1. Semi-transparent background overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    overlay.setOrigin(0, 0);
    overlay.setDepth(0);
    
    // 2. Title
    const title = this.add.text(width / 2, 120, 'LEVEL UP!', {
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(1);
    
    // Add glow animation to title
    this.tweens.add({
      targets: title,
      alpha: { from: 0.8, to: 1 },
      scale: { from: 0.95, to: 1.05 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    // 3. Subtitle
    this.add.text(width / 2, 170, 'Choose an upgrade', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(1);
    
    // 4. Create card container
    this.cardContainer = this.add.container(0, 0);
    this.cardContainer.setDepth(2);
    
    // 5. Get and render options
    this.refreshOptions();
    
    // 6. Footer buttons
    this.createFooterButtons();
    
    // 7. Entry animation
    this.cameras.main.setAlpha(0);
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 1,
      duration: 200
    });
  }
  
  private refreshOptions(): void {
    // Clear existing cards
    this.cardContainer.removeAll(true);
    
    // Get new options (now includes weapons)
    this.options = LevelUpManager.getOptions(
      this.player, 
      this.characterState, 
      4, 
      this.activeWeaponIds
    );
    
    if (this.options.length === 0) {
      this.showNoOptionsMessage();
      return;
    }
    
    this.renderCards();
  }
  
  private renderCards(): void {
    const { width, height } = this.scale;
    const totalCards = this.options.length;
    const totalWidth = totalCards * this.CARD_WIDTH + (totalCards - 1) * this.CARD_SPACING;
    const startX = (width - totalWidth) / 2 + this.CARD_WIDTH / 2;
    const centerY = height / 2 + 40;
    
    this.options.forEach((option, index) => {
      const x = startX + index * (this.CARD_WIDTH + this.CARD_SPACING);
      const card = this.createCard(option, x, centerY, index);
      this.cardContainer.add(card);
    });
  }
  
  private createCard(option: LevelUpOption, x: number, y: number, index: number): Phaser.GameObjects.Container {
    const card = this.add.container(x, y);
    
    // Card background with rounded corners effect (using rectangle with stroke)
    const bg = this.add.rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT, this.CARD_COLOR, 1);
    bg.setStrokeStyle(3, this.CARD_BORDER_COLOR);
    card.add(bg);
    
    // Type badge - color based on option type
    let badgeColor = this.UPGRADE_BADGE_COLOR;
    if (option.type === 'NEW_ITEM') {
      badgeColor = this.NEW_BADGE_COLOR;
    } else if (option.type === 'UPGRADE_WEAPON') {
      badgeColor = this.WEAPON_BADGE_COLOR;
    } else if (option.type === 'NEW_WEAPON') {
      badgeColor = this.NEW_WEAPON_BADGE_COLOR;
    }
    const badge = this.add.rectangle(0, -this.CARD_HEIGHT / 2 + 25, this.CARD_WIDTH - 20, 30, badgeColor, 1);
    badge.setStrokeStyle(2, 0xffffff);
    card.add(badge);
    
    const badgeText = this.add.text(0, -this.CARD_HEIGHT / 2 + 25, option.displayLevel, {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    card.add(badgeText);
    
    // Item icon placeholder (circle with first letter)
    const iconBg = this.add.circle(0, -25, 35, 0x1abc9c, 1);
    iconBg.setStrokeStyle(2, 0xffffff);
    card.add(iconBg);
    
    const iconLetter = this.add.text(0, -25, option.displayName.charAt(0).toUpperCase(), {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    card.add(iconLetter);
    
    // Item name
    const nameText = this.add.text(0, 35, option.displayName, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    }).setOrigin(0.5);
    card.add(nameText);
    
    // Description (truncated)
    const descText = this.add.text(0, 70, option.description, {
      fontSize: '12px',
      color: '#bdc3c7',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    }).setOrigin(0.5, 0);
    card.add(descText);
    
    // Interactivity
    bg.setInteractive({ useHandCursor: true });
    
    bg.on('pointerover', () => {
      bg.setFillStyle(this.CARD_HOVER_COLOR);
      this.tweens.add({
        targets: card,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(this.CARD_COLOR);
      this.tweens.add({
        targets: card,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    bg.on('pointerdown', () => {
      this.selectCard(option);
    });
    
    // Entry animation
    card.setAlpha(0);
    card.setY(y + 50);
    this.tweens.add({
      targets: card,
      alpha: 1,
      y: y,
      duration: 300,
      delay: index * 100,
      ease: 'Back.easeOut'
    });
    
    return card;
  }
  
  private selectCard(option: LevelUpOption): void {
    // Apply the selection (pass characterState and callbacks)
    LevelUpManager.selectOption(
      this, 
      this.player, 
      this.characterState,
      option,
      this.onWeaponUpgrade,
      this.onNewWeapon
    );
    
    // Close scene and callback
    this.closeScene();
  }
  
  private showNoOptionsMessage(): void {
    const { width, height } = this.scale;
    
    this.add.text(width / 2, height / 2, 'All items are at max level!', {
      fontSize: '24px',
      color: '#f1c40f',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(3);
    
    // Auto-close after a short delay
    this.time.delayedCall(2000, () => {
      this.closeScene();
    });
  }
  
  private createFooterButtons(): void {
    const { width, height } = this.scale;
    const buttonY = height - 50;
    
    // Reroll button
    this.createButton(width / 2 - 100, buttonY, 'Reroll', 0x9b59b6, () => {
      this.refreshOptions();
    });
    
    // Skip button
    this.createButton(width / 2 + 100, buttonY, 'Skip', 0xe74c3c, () => {
      this.closeScene();
    });
  }
  
  private createButton(x: number, y: number, text: string, color: number, onClick: () => void): Phaser.GameObjects.Container {
    const btn = this.add.container(x, y);
    btn.setDepth(3);
    
    const bg = this.add.rectangle(0, 0, 140, 45, color, 1);
    bg.setStrokeStyle(2, 0xffffff);
    bg.setInteractive({ useHandCursor: true });
    
    const label = this.add.text(0, 0, text, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    btn.add([bg, label]);
    
    bg.on('pointerover', () => bg.setAlpha(0.8));
    bg.on('pointerout', () => bg.setAlpha(1));
    bg.on('pointerdown', onClick);
    
    return btn;
  }
  
  private closeScene(): void {
    console.log('[LevelUpScene] Closing scene...');
    
    // Note: We don't resume physics here - the caller (MainScene or DevConsole) 
    // manages its own pause state
    
    // Call completion callback immediately
    if (this.onComplete) {
      this.onComplete();
    }
    
    // Fade out and stop scene
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        // Stop and remove this scene
        this.scene.stop();
      }
    });
  }
}
