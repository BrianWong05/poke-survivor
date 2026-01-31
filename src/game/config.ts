import Phaser from 'phaser';
import { Preloader } from '@/game/scenes/Preloader';
import { MainScene } from '@/game/scenes/MainScene';
import { LevelUpScene } from '@/game/scenes/LevelUpScene';

export interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
  onQuit: () => void;
  onLevelUpdate?: (level: number, xp: number, xpToNext: number) => void;
  onTimeUpdate?: (time: number) => void;
}

export const createGameConfig = (
  parent: HTMLElement,
  callbacks: GameCallbacks
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, MainScene, LevelUpScene],
  callbacks: {
    preBoot: (game) => {
      // Store callbacks in game registry for scene access
      game.registry.set('callbacks', callbacks);
    },
  },
});
