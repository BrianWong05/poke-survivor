import Phaser from 'phaser';
import i18n from '@/i18n';
import type { GameCallbacks } from '@/game/config';
import { ExperienceManager } from '@/game/systems/ExperienceManager';
import { type CharacterState } from '@/game/entities/characters/types';

export class UIManager {
  private scene: Phaser.Scene;
  private callbacks: GameCallbacks;
  private experienceManager: ExperienceManager;
  private characterState: CharacterState;
  
  private pauseContainer?: Phaser.GameObjects.Container;
  private isPaused = false;
  private isLevelUpPending = false;
  private isGameOver = false;

  constructor(
      scene: Phaser.Scene, 
      callbacks: GameCallbacks,
      experienceManager: ExperienceManager,
      characterState: CharacterState
  ) {
    this.scene = scene;
    this.callbacks = callbacks;
    this.experienceManager = experienceManager;
    this.characterState = characterState;
  }

  public setGameOver(gameOver: boolean): void {
      this.isGameOver = gameOver;
  }
  
  public setLevelUpPending(pending: boolean): void {
      this.isLevelUpPending = pending;
  }

  public setPaused(paused: boolean, showMenu: boolean = true): void {
     if (this.isPaused === paused) return;
     this.togglePause(() => {}, showMenu);
  }

  public togglePause(onPauseChange: (isPaused: boolean) => void, showMenu: boolean = true): void {
    // block pause if level up or game over
    if (this.isLevelUpPending || this.isGameOver) return;

    this.isPaused = !this.isPaused;
    onPauseChange(this.isPaused);

    if (this.isPaused) {
      if (this.scene.physics.world) this.scene.physics.pause();
      this.scene.anims.pauseAll();
      this.scene.tweens.pauseAll(); // Fix: Stop all tweens (e.g. Water Pulse breathing)
      this.scene.time.paused = true; 
      
      if (showMenu) {
          this.createPauseMenu(() => this.togglePause(onPauseChange, showMenu));
      }

    } else {
      if (this.scene.physics.world) this.scene.physics.resume();
      this.scene.anims.resumeAll();
      this.scene.tweens.resumeAll(); // Fix: Resume tweens
      this.scene.time.paused = false;
      
      if (this.pauseContainer) {
        this.pauseContainer.destroy();
        this.pauseContainer = undefined;
      }
    }
  }

  private createPauseMenu(onResume: () => void): void {
      const width = this.scene.scale.width;
      const height = this.scene.scale.height;
      
      this.pauseContainer = this.scene.add.container(0, 0);
      this.pauseContainer.setDepth(200);

      // Darken background
      const dimmer = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.5);
      dimmer.setOrigin(0);
      this.pauseContainer.add(dimmer);

      // Window Background
      const windowWidth = 400;
      const windowHeight = 280;
      const windowBg = this.scene.add.rectangle(width / 2, height / 2, windowWidth, windowHeight, 0x2c3e50, 1);
      windowBg.setStrokeStyle(4, 0xecf0f1);
      this.pauseContainer.add(windowBg);

      // Title
      const title = this.scene.add.text(width / 2, height / 2 - 80, i18n.t('pause_title'), {
        fontSize: '48px',
        color: '#f1c40f',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }).setOrigin(0.5);
      this.pauseContainer.add(title);

      // Subtitle (Cancel/Resume)
      const resumeBtn = this.createButton(width / 2, height / 2 + 20, i18n.t('pause_resume'), '#2ecc71', onResume);
      this.pauseContainer.add(resumeBtn);

      // Quit Button
      const quitBtn = this.createButton(width / 2, height / 2 + 90, i18n.t('pause_quit'), '#e74c3c', () => {
        if (this.callbacks.onQuit) {
          this.callbacks.onQuit();
        }
      });
      this.pauseContainer.add(quitBtn);
  }

  public showLevelUpMenu(onComplete: () => void): void {
    console.log('Level Up Menu Open');
    
    if (this.scene.sys.settings.status === Phaser.Scenes.RUNNING) {
      this.scene.scene.pause();
    }
    
    this.updateLevelUI();
    
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    
    const overlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);
    overlay.setDepth(100);
    
    const levelUpText = this.scene.add.text(width / 2, height / 2 - 20, 'LEVEL UP!', {
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(101);
    
    const continueText = this.scene.add.text(width / 2, height / 2 + 40, 'Press ENTER to Continue', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(101);
    
    const resumeHandler = (e: KeyboardEvent) => {
      // Guard against zombie listeners
      if (!this.scene.sys || !this.scene.scene) {
        window.removeEventListener('keydown', resumeHandler);
        return;
      }

      if (e.code === 'Enter') {
         overlay.destroy();
         levelUpText.destroy();
         continueText.destroy();
         
         window.removeEventListener('keydown', resumeHandler);
         this.scene.events.off('shutdown', cleanupHandler);
         this.scene.events.off('destroy', cleanupHandler);
         
         onComplete();
      }
    };

    const cleanupHandler = () => {
       window.removeEventListener('keydown', resumeHandler);
    };
    
    this.scene.events.once('shutdown', cleanupHandler);
    this.scene.events.once('destroy', cleanupHandler);
    
    window.setTimeout(() => {
       if (this.scene.sys && this.scene.scene) {
          window.addEventListener('keydown', resumeHandler);
       }
    });
  }

  public updateLevelUI(): void {
    this.characterState.level = this.experienceManager.currentLevel;
    this.characterState.xp = this.experienceManager.currentXP;
    this.characterState.xpToNextLevel = this.experienceManager.xpToNextLevel;

    const roundedXp = Math.floor(this.characterState.xp);
    if (this.callbacks.onLevelUpdate) {
      this.callbacks.onLevelUpdate(this.characterState.level, roundedXp, this.characterState.xpToNextLevel);
    }
    
    window.dispatchEvent(new CustomEvent('xp-update', {
      detail: {
        current: roundedXp,
        max: this.characterState.xpToNextLevel,
        level: this.characterState.level,
      },
    }));
  }

  private createButton(x: number, y: number, text: string, color: string, onClick: () => void): Phaser.GameObjects.Container {
    const btn = this.scene.add.container(x, y);
    
    const bg = this.scene.add.rectangle(0, 0, 200, 50, Number(color.replace('#', '0x')), 1);
    bg.setStrokeStyle(2, 0xffffff);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', onClick);
    bg.on('pointerover', () => bg.setAlpha(0.8));
    bg.on('pointerout', () => bg.setAlpha(1));
    
    const label = this.scene.add.text(0, 0, text, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    btn.add([bg, label]);
    return btn;
  }
}
