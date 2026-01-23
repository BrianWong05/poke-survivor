import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import nipplejs from 'nipplejs';
import type { JoystickManager } from 'nipplejs';
import { createGameConfig, type GameCallbacks } from '@/game/config';
import { MainScene } from '@/game/scenes/MainScene';
import './styles.css';

interface GameCanvasProps {
  onScoreUpdate: (score: number) => void;
  onHPUpdate: (hp: number) => void;
  onGameOver: () => void;
}

export const GameCanvas = ({ onScoreUpdate, onHPUpdate, onGameOver }: GameCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const joystickManagerRef = useRef<JoystickManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const callbacks: GameCallbacks = {
      onScoreUpdate,
      onHPUpdate,
      onGameOver,
    };

    // Create Phaser game
    const config = createGameConfig(containerRef.current, callbacks);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Setup nipplejs for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice && joystickRef.current) {
      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '80px', bottom: '80px' },
        color: 'rgba(255, 255, 255, 0.5)',
        size: 120,
      });

      manager.on('move', (_evt, data) => {
        const scene = game.scene.getScene('MainScene') as MainScene;
        if (scene && data.vector) {
          scene.setJoystickVector(data.vector.x, -data.vector.y);
        }
      });

      manager.on('end', () => {
        const scene = game.scene.getScene('MainScene') as MainScene;
        if (scene) {
          scene.setJoystickVector(0, 0);
        }
      });

      joystickManagerRef.current = manager;
    }

    // Cleanup
    return () => {
      if (joystickManagerRef.current) {
        joystickManagerRef.current.destroy();
        joystickManagerRef.current = null;
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onScoreUpdate, onHPUpdate, onGameOver]);

  return (
    <div className="game-container">
      <div ref={containerRef} className="phaser-container" />
      <div ref={joystickRef} className="joystick-zone" />
    </div>
  );
};
